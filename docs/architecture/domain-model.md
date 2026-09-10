# DDD domain model

**Status:** PROPOSED target model; repositorydagi mavjud modullar bilan bosqichma-bosqich moslashtiriladi.

## Ubiquitous language

| Atama                      | Ma’nosi                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| User                       | Authentication identity; biznes profil emas                           |
| Candidate                  | Ish izlovchi va resume egasi                                          |
| Company                    | Ish beruvchi tashkilot va job owner                                   |
| Agent                      | Candidate va Company orasidagi vakolatli vositachi                    |
| Job                        | Company yaratadigan va lifecycle orqali publish qilinadigan vakansiya |
| Application                | Candidate’ning Job’ga arizasi va recruitment lifecycle’i              |
| Resume extraction proposal | AI yaratgan, hali Candidate tasdiqlamagan strukturaviy taklif         |
| Assignment                 | Agent’ning muayyan Company bilan ishlash vakolati                     |

## Bounded context’lar

| Context              | Classification            | Authoritative data                    | Muhim qoidalar                                      |
| -------------------- | ------------------------- | ------------------------------------- | --------------------------------------------------- |
| Identity & Access    | Generic                   | User, credential, refresh token, role | Identity va session lifecycle                       |
| Candidate Career     | Core                      | Candidate, Resume, preferences        | Resume ownership, limits, confirmation              |
| Company Onboarding   | Supporting                | Company, approval state               | Faqat pending company review qilinadi               |
| Job Catalog          | Core                      | Job, publishing lifecycle             | Faqat vakolatli company/agent state’ni o‘zgartiradi |
| Recruitment Pipeline | Core                      | Application, status history           | Duplicate apply yo‘q; transition policy majburiy    |
| Agent Operations     | Supporting                | Agent-Company assignment              | Assigned resource’largagina kirish                  |
| Communication        | Supporting                | Conversation, Message, Notification   | Candidate–Company aloqa Agent orqali                |
| AI Processing        | Supporting/Core candidate | Processing run, proposal              | AI taklif beradi, business fact yaratmaydi          |
| Governance & Audit   | Generic                   | AI execution/audit metadata           | Usage, version, outcome va actor kuzatiladi         |
| Integration          | Generic                   | Outbox event, processed message       | At-least-once delivery va idempotent consumer       |

## Aggregate va consistency chegaralari

- `Application`: status va status-history o‘zgarishi bitta transaction; tashqi notification outbox orqali.
- `Company`: approval state, account activation va assignment o‘zgarishi bitta use case transaction’i.
- `Resume`: structured sections va confirmed extraction bitta transaction.
- `Job`: lifecycle transition faqat current state va actor vakolati asosida.
- `AIExecution`: request identity va lifecycle transition idempotent/concurrency-safe bo‘lishi kerak.

## Context map

```text
Identity & Access
  ├─ identity → Candidate Career
  ├─ identity → Company Onboarding
  └─ identity → Agent Operations

Company Onboarding ──approved company──> Job Catalog
Candidate Career ──candidate/resume reference──> Recruitment Pipeline
Job Catalog ──published job reference──> Recruitment Pipeline
Agent Operations ──authorization policy──> Company / Job / Application

Core contexts ──domain events──> Integration
Integration ──messages──> Communication / AI Processing
AI Processing ──proposal──> Candidate Career
Governance & Audit <──execution metadata── AI Processing
```

## Dependency va ownership qoidalari

- Har bir persistent business fact’ning bitta authoritative context’i bo‘ladi.
- Contextlar boshqa context jadvalini tasodifiy Prisma query orqali boshqarmaydi; kerakli use case yoki aniq contract ishlatiladi.
- Cross-context side effect synchronous transactionga qo‘shilmaydi; outbox event orqali yetkaziladi.
- Aggregate’lar boshqa aggregate’larni object graph bilan emas, identifier orqali ko‘rsatadi.
- Domain event o‘tgan zamonda nomlanadi: `ApplicationSubmitted`, `CompanyApproved`.

## Ochiq savollar

- Agent assignment lifecycle va reassignment qoidalari to‘liq tasdiqlanmagan.
- Multi-tenant chegarasi Company darajasidami yoki kelajakda Organization/Tenant alohida tushunchami — UNKNOWN.
- Candidate ma’lumotini Agent bilan share qilish consent modeli — UNKNOWN.
- Application pipeline’dagi barcha legal transition va reversal qoidalari stakeholder bilan tasdiqlanishi kerak.
