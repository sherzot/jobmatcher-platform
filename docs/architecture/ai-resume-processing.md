# AI Resume Processing — Architecture and Production Design

## 1. Decision summary

**Status:** Proposed target with an implemented persistence/API foundation.

**DECISION:** Keep resume processing inside the existing NestJS modular monolith
until an independently scalable worker or AI service is justified by observed
load, ownership, or isolation requirements. `Resume` owns candidate-confirmed
structured data, `ResumeProcessingRun` owns the extraction lifecycle,
`AIExecution` owns provider usage metadata, and `Integration` owns durable
message delivery.

The next runtime integration must use ports for object storage, queue transport,
and parsing. Concrete adapters remain blocked until the decisions in section 13
are resolved.

## 2. Scope

In scope:

- candidate-initiated resume extraction;
- asynchronous parsing orchestration;
- untrusted AI output validation;
- candidate confirmation or rejection;
- idempotency, retries, audit metadata, and operator recovery;
- local and target runtime boundaries.

Out of scope:

- job matching, embeddings, recommendations, and RAG;
- provider selection or prompt design;
- production cloud provider, region, SLO, RPO, RTO, and cost estimates;
- automatic mutation of a candidate resume without confirmation.

## 3. Verified current state

- The API is a NestJS modular monolith using Prisma and MySQL.
- `ResumeProcessingRun`, `AIExecution`, `OutboxEvent`, and `ProcessedMessage`
  persistence models exist.
- Candidate endpoints can request, inspect, confirm, and reject extraction.
- AI proposals are runtime-validated before persistence and again before
  confirmation.
- Confirming a proposal and replacing structured resume sections share one
  database transaction.
- Outbox publishing has compare-and-set claims, bounded retry, failed state, and
  stale-claim recovery. Inbox processing records deduplication with database
  effects in one transaction.
- The local Compose file defines MySQL, Redis, MinIO, and phpMyAdmin only.
- No queue adapter, outbox scheduler, parser consumer, AI service source,
  application Dockerfile, or CI workflow exists in the repository.

The last item means the asynchronous path is not operational end to end.

## 4. Ubiquitous language and ownership

| Term | Meaning | Authoritative context |
|---|---|---|
| Resume | Candidate-confirmed structured career document | Resume |
| Extraction request | Intent to parse one immutable stored document | Resume |
| Processing run | Lifecycle and proposal for one extraction request | Resume |
| Proposal | Untrusted structured output awaiting candidate decision | Resume |
| AI execution | Provider/model/prompt version, usage, cost, and outcome metadata | AI Governance |
| Outbox event | Durable intent to publish a completed fact | Integration |
| Processed message | Consumer-specific deduplication record | Integration |
| Document object key | Stable private-storage identifier, not a public URL | Storage adapter; exact ownership model UNKNOWN |

`Candidate`, `User`, and `tenant` are not interchangeable. The current schema
models candidate ownership, but a broader tenant model is **UNKNOWN**.

## 5. Bounded-context map

```text
Candidate HTTP client
        |
        v
Resume context ------ metadata reference ------> AI Governance
   |                                             context
   |
   +------ transactional domain facts --------> Integration context
                                                    |
                                                    v
                                             Queue adapter (PROPOSED)
                                                    |
                                                    v
Storage adapter (PROPOSED) <------ Parser worker / AI adapter (PROPOSED)
```

Relationships:

- Resume is the upstream owner of processing lifecycle and confirmed content.
- AI Governance is a supporting context; it does not decide resume state.
- Integration is a generic context; it transports facts without owning their
  business meaning.
- Storage and parser adapters form anti-corruption boundaries around vendor
  object and model contracts.

## 6. Aggregate boundaries and invariants

### ResumeProcessingRun aggregate

Commands:

- `RequestResumeExtraction`
- `MarkExtractionProcessing`
- `RecordExtractionProposal`
- `FailExtraction`
- `ConfirmExtraction`
- `RejectExtraction`
- `ExpireExtraction` — designed, not implemented

Events:

- `ResumeParsingRequested`
- `ResumeExtractionProposed`
- `ResumeExtractionConfirmed`
- `ResumeExtractionRejected`
- `ResumeExtractionFailed` — proposed
- `ResumeExtractionExpired` — proposed

Invariants:

- an idempotency key is candidate-scoped;
- reusing a key with a different object key or hash is rejected;
- only the owning candidate can query, confirm, or reject a run;
- only `PROCESSING` can produce a proposal;
- only `PROPOSED` can be confirmed or rejected;
- model output is untrusted and must match the proposal schema;
- resume content changes only after explicit candidate confirmation;
- confirmation, content replacement, and confirmation event are atomic.

### AIExecution aggregate

Commands:

- `RequestAIExecution`
- `StartAIExecution`
- `CompleteAIExecution`
- `FailAIExecution`
- `BlockAIExecution`

Invariants:

- the same idempotency key cannot represent different execution metadata;
- usage counters and latency are non-negative safe integers;
- only declared lifecycle transitions are allowed;
- raw prompts, documents, and model output are excluded from audit metadata.

## 7. Clean Architecture dependency rules

Stable domain policies must not import NestJS, Prisma, HTTP DTOs, queue clients,
storage SDKs, or AI SDKs. Application orchestration may depend on domain policy
and narrow consumer-owned ports. Adapters implement those ports and translate
external data at the trust boundary. Nest modules remain the composition root.

Target ports for the parser vertical slice:

```ts
interface ResumeDocumentReader {
  readAuthorizedDocument(input: {
    candidateId: number;
    objectKey: string;
    sha256: string;
  }): Promise<ReadableDocument>;
}

interface ResumeParser {
  parse(input: ReadableDocument, deadline: Date): Promise<unknown>;
}

interface ResumeParsingQueue {
  publish(message: ResumeParsingRequestedV1): Promise<void>;
}
```

These are contract sketches, not implemented interfaces. Stream type, maximum
size, supported formats, and deadline are blockers.

Intentional transitional coupling:

- application services currently use Prisma directly;
- Nest exceptions are currently mapped inside services;
- persistence repositories are not introduced until a second adapter or test
  seam creates a concrete need.

## 8. Critical sequence

```text
Candidate -> API: RequestResumeExtraction
API -> MySQL: transaction(run + ResumeParsingRequested)
API --> Candidate: 201 with run status

Outbox scheduler -> MySQL: claim event
Outbox scheduler -> Queue: publish event
Queue -> Parser consumer: at-least-once delivery
Parser consumer -> Inbox/MySQL: begin deduplicated transaction boundary
Parser consumer -> Storage: authorize and read immutable object
Parser consumer -> AI provider: parse with timeout and bounded budget
Parser consumer -> API application boundary: validate and record proposal
API -> MySQL: proposal + ResumeExtractionProposed

Candidate -> API: ConfirmExtraction
API -> MySQL: transaction(confirm + replace sections + event)
```

Network calls must not execute inside database transactions. The parser consumer
must persist progress before external work and use idempotent completion.

## 9. Contracts and failure semantics

Existing candidate HTTP contracts:

- `POST /api/resume/extractions`
- `GET /api/resume/extractions/:id`
- `POST /api/resume/extractions/:id/confirm`
- `POST /api/resume/extractions/:id/reject`

`ResumeParsingRequested` version 1 minimum payload:

```json
{
  "runId": "uuid",
  "candidateId": 1,
  "resumeId": 1,
  "documentObjectKey": "private/object/key",
  "documentSha256": "lowercase-sha256"
}
```

Delivery expectation is at least once. Consumers deduplicate by consumer name
and event ID. Event ordering is required only per processing run. A consumer
must reject unknown schema versions and move poison messages to an operator
recovery path.

Error categories:

- invalid request or proposal: permanent validation failure;
- ownership denial: permanent authorization failure;
- state conflict: safe client or worker reconciliation;
- storage object missing or hash mismatch: permanent until operator/user action;
- provider timeout/rate limit/unavailability: bounded transient retry;
- provider safety or schema rejection: permanent execution failure;
- exhausted delivery: failed/dead-letter state with operator replay.

## 10. Security and privacy

Trust boundaries:

- candidate request input;
- uploaded file and its claimed content type;
- queue payload;
- stored document content;
- AI provider input/output;
- admin audit queries.

Required controls before enabling a parser consumer:

- object ownership must be derived from authenticated candidate context;
- buckets must remain private;
- object size, format, magic bytes, malware policy, and SHA-256 must be checked;
- provider input must minimize personal data and use an approved retention mode;
- document instructions must never override parser policy;
- output must pass schema and business invariant validation;
- state-changing application requires candidate confirmation;
- logs/events must exclude raw document and model content;
- storage, queue, AI, and database credentials must be distinct and least
  privilege.

Cross-tenant storage authorization is not yet verifiable because the storage
adapter and tenant/object namespace do not exist.

## 11. Reliability, observability, and recovery

Required signals:

- outbox pending/processing/failed counts and oldest event age;
- publish attempts, latency, and stale claims;
- queue depth, oldest job age, retries, and dead letters;
- processing-run count and age by status;
- provider latency, error class, tokens, and cost;
- proposal validation failures and confirmation/rejection outcomes;
- storage missing/hash mismatch counts.

Required runbooks:

- release stale outbox claims;
- replay a failed event with audit attribution;
- reconcile processing runs with AI executions;
- handle missing or quarantined objects;
- disable a provider/model/prompt version;
- delete expired documents and dependent derived data.

Retention for outbox, inbox, AI metadata, proposals, and raw resume objects is
**UNKNOWN** and blocks cleanup implementation.

## 12. Infrastructure and delivery

Verified local topology:

- Docker Compose: MySQL, Redis, MinIO, phpMyAdmin;
- API and web run from local Node processes;
- no committed CI/CD or production deployment manifests.

**DECISION:** Do not introduce Kubernetes now. There is no repository evidence
of multiple deployed workloads, an operating owner, or requirements that exceed
a simpler container platform.

Proposed deployable units after blockers are resolved:

- web;
- API;
- durable parser/outbox worker;
- MySQL;
- Redis-backed queue;
- private object storage;
- external or separately deployed parser provider.

Build once and promote immutable artifacts. Apply additive database migrations
before code that requires new tables. Roll forward rather than removing the new
tables during the initial release. Production provider, account, region,
network, IAM, backup, and restore design remain **UNKNOWN**.

## 13. Blockers and required decisions

1. Bull package and runtime: Bull versus BullMQ, ownership, scheduler, retry,
   dead-letter, and graceful-shutdown semantics.
2. Storage: S3-compatible provider, object namespace, upload authorization,
   maximum size, PDF/DOCX policy, malware scanning, retention, and deletion.
3. Parser: provider, model, prompt/schema version, OCR path, timeout, token
   budget, privacy/retention contract, and failure classification.
4. Product: whether confirmation replaces all structured content or supports a
   field-level merge.
5. Operations: environments, production platform, region/residency, SLO, RPO,
   RTO, alert ownership, and audit retention.
6. Workload: request rate, peak concurrency, document size distribution, and
   monthly AI budget.

No capacity or cost number is stated because these inputs are unavailable.

## 14. Incremental implementation slices

1. **Implemented foundation:** lifecycle schema, policies, candidate API,
   transactional confirmation, outbox/inbox, AI metadata.
2. **Decision gate:** resolve section 13 items 1–4.
3. **Storage slice:** authorized upload/read/delete port, adapter, lifecycle, and
   integration tests.
4. **Queue slice:** transport adapter, scheduler/worker composition, dead-letter
   and replay tooling, contract tests.
5. **Parser slice:** provider adapter, timeouts/budgets, schema translation,
   prompt-injection fixtures, and sandbox verification.
6. **Operations slice:** metrics, dashboards, alerts, runbooks, retention, and
   reconciliation.
7. **Deployment slice:** immutable containers, CI, migration validation,
   environment promotion, smoke test, and restore exercise.

## 15. Architecture fitness checks

- domain source must not import NestJS, Prisma, DTO, controller, module, or
  service adapters;
- every processing transition has positive and negative policy tests;
- every retryable command has an idempotency collision test;
- outbox events are written in the same transaction as the business fact;
- candidate ownership denial is integration-tested with two identities;
- concrete queue/storage/provider adapters have contract tests;
- production rollout cannot proceed without migration validation, end-to-end
  parser verification, observability, and an operator recovery exercise.

## 16. Alternatives

### Put parsing directly in the HTTP request

Rejected: it couples request latency to storage/model availability and cannot
provide durable retry or recovery.

### Create multiple microservices immediately

Rejected: the repository has one API deployment and no operational evidence
that distributed ownership or scaling offsets network and platform cost.

### Let AI output update Resume directly

Rejected: model output is untrusted and resume mutation is consequential.

### Event sourcing

Rejected: lifecycle audit and integration intent are served by explicit state,
outbox events, and AI execution metadata without event-sourcing complexity.

## 17. Review triggers

Revisit the modular-monolith/worker boundary when at least one is verified:

- parser workload needs independent scaling or isolation;
- API deployments are blocked by parser dependencies;
- a separate team owns parser releases;
- provider or compliance policy requires a distinct trust boundary;
- measured queue latency or resource saturation cannot be resolved within the
  current deployable.
