# AI engineering roadmap

**Status:** foundation IN PROGRESS; real model/provider execution PLANNED.

## AI uchun asosiy tamoyil

AI business qarorini mustaqil yakunlamaydi. U proposal, explanation yoki recommendation beradi; authorization, invariant va final state transition deterministic application/domain code tomonidan boshqariladi.

## Bosqichlar

### 1. Resume extraction

```text
Authorized private upload
→ validation and malware scan
→ ResumeParsingRequested
→ idempotent worker
→ OCR/parser/model
→ strict schema validation
→ candidate-visible proposal
→ explicit confirm/reject
→ transactional Resume update
```

Batafsil dizayn: [../architecture/ai-resume-processing.md](../architecture/ai-resume-processing.md).

### 2. Matching baseline

Avval deterministic baseline:

- hard eligibility: status, location/work mode, visa, language va job availability;
- explainable weighted score;
- missing-data handling;
- har bir score component’ining sababi.

Embedding/semantic retrieval faqat offline evaluation baseline’dan foyda ko‘rsatganda qo‘shiladi.

### 3. Recommendation va assistant

Resume extraction va matching governance barqarorlashmaguncha state-changing agent yoki autonomous application action joriy qilinmaydi.

## AI execution contract

Har bir execution quyidagilarni boshqaradi:

- purpose va actor;
- idempotency key;
- provider/model va prompt/schema version;
- timeout, token va cost budget;
- input reference, lekin raw sensitive content emas;
- status, latency, usage, cost va sanitized error code;
- retry va terminal failure classification.

## Evaluation matrix

- valid Japanese/Uzbek/English resume fixtures;
- malformed PDF/DOCX va OCR failure;
- prompt-injection matni mavjud hujjat;
- schema-invalid yoki partial model output;
- duplicate delivery va timeout;
- boshqa candidate proposal’iga kirish;
- PII leakage va log redaction;
- matching false-positive/false-negative review dataset.

## BLOCKER qarorlar

- Provider, model va privacy/retention contract.
- OCR va supported file formatlar.
- Maksimal file/token/cost limitlari.
- Queue runtime va worker deployment.
- Matching acceptance metrics va evaluation dataset ownership.
