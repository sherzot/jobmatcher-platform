# Yetkazib berish roadmap’i

Roadmapning maqsadi — yangi funksiyalarni ko‘paytirishdan oldin ishlaydigan, tekshiriladigan va xavfsiz vertikal MVP oqimini yaratish.

## Asosiy qaror

`DECISION`: hozircha modular monolith saqlanadi. Alohida deploy qilinadigan microservice faqat mustaqil scaling, failure isolation yoki ownership zarurati repository/runtime dalili bilan ko‘rsatilganda ko‘rib chiqiladi. Background AI va notification ishlari worker sifatida ajratilishi mumkin, lekin business source of truth API database’da qoladi.

## Phase 0 — Documentation baseline

**Status:** IN PROGRESS

- [x] Hujjatlar indexini yaratish.
- [x] Joriy loyiha holatini reja va da’volardan ajratish.
- [x] DDD, Clean Architecture, Security va AI uchun alohida yo‘nalish hujjatlarini yaratish.
- [x] `DEVLOG.md` yuritish tartibini joriy qilish.
- [ ] Muhim arxitektura qarorlarini ADR formatiga ko‘chirish.

**Done:** yangi contributor joriy holat, keyingi prioritet va ochiq blockerlarni `docs/README.md`dan topa oladi.

## Phase 1 — Branch stabilization

**Status:** NEXT

- [ ] Joriy modified/untracked o‘zgarishlarni mantiqiy guruhlarga ajratib review qilish.
- [x] Prisma schema va migration mosligini local Docker MySQL instance’da tekshirish.
- [x] API unit tests va buildni dependency tree tiklangandan keyin bajarish.
- [x] Web production buildni sandbox tashqarisida bajarish.
- [x] API full lint clean qilish va warning/error’larni mantiqiy batchlarga ajratish.
- [x] Web lintni blocking error’siz holatga keltirish (14 warning qolgan).
- [ ] CI quality gates: format, lint, typecheck, unit test, integration test va build.
- [ ] README’dagi implementation da’volarini yakuniy tekshiruv natijalariga moslashtirish.

**Done:** barcha majburiy checklar zero exit status bilan tugaydi; migration clean database’da qo‘llanadi; worktree o‘zgarishlari review qilinadigan commitlarga bo‘lingan.

## Phase 2 — Real vertical MVP slice

**Status:** PLANNED

Maqsadli oqim:

```text
Company registration
→ Agent approval
→ Company creates job
→ Agent publishes job
→ Candidate views job
→ Candidate applies
→ Agent changes application status
→ Candidate sees the new status
```

- [x] Real API client va auth/job/application typed request/response contractlari uchun boshlang‘ich qatlam.
- [x] Public job search va job detail real API bilan ulandi.
- [x] Candidate apply va application history real API bilan ulandi.
- [ ] Cookie-based authentication refresh flow va server-side session expiry UX.
- [ ] Mock ma’lumotlarni shu oqimdan olib tashlash.
- [ ] Resource ownership va assignment integration tests.
- [ ] Loading, empty, validation va failure UI holatlari.
- [ ] Critical flow uchun E2E test.

**Done:** yuqoridagi oqim clean database’dan boshlab brauzer E2E testida ishlaydi va boshqa role/resource’ga ruxsatsiz kirish rad etiladi.

## Phase 3 — Security baseline

**Status:** PLANNED

- [ ] Cookie, CSRF, CORS va refresh-token rotation.
- [ ] Auth rate limiting va abuse controls.
- [ ] Audit log va sensitive-data redaction.
- [ ] File upload security va private object lifecycle.
- [ ] Dependency, secret va container scanning.
- [ ] Security integration/E2E test matrix.

**Done:** [security/README.md](./security/README.md) dagi P0 control’lar tegishli test daliliga ega.

## Phase 4 — Async delivery va file lifecycle

**Status:** PLANNED / BLOCKED BY DECISIONS

- [ ] Queue texnologiyasi va runtime ownership bo‘yicha ADR.
- [ ] Outbox transport va worker composition.
- [ ] DLQ, replay, reconciliation va operator runbook.
- [ ] Private storage port/adapter, scanning, retention va deletion.
- [ ] Email va in-app notification consumer’lari.

**Done:** retry, duplicate delivery, permanent failure va recovery integration testlarda ko‘rsatilgan.

## Phase 5 — AI resume MVP

**Status:** PLANNED / BLOCKED BY DECISIONS

- [ ] Provider/parser ADR va privacy contract.
- [ ] Schema-validated proposal pipeline.
- [ ] Candidate preview, confirm va reject UX.
- [ ] Token/cost/time budget va AI audit.
- [ ] Prompt-injection, malformed document va cross-user test fixtures.

**Done:** AI output Resume’ni to‘g‘ridan-to‘g‘ri o‘zgartirmaydi; faqat owner candidate tasdig‘i bilan transaction ichida qo‘llanadi.

## Phase 6 — Matching va operations

**Status:** PLANNED

- [ ] Eligibility filter va deterministic scoring baseline.
- [ ] Offline evaluation dataset va acceptance metrics.
- [ ] Zarurat tasdiqlansa embeddings/semantic retrieval eksperimenti.
- [ ] Structured logs, metrics, traces, dashboard va alerts.
- [ ] Backup/restore, migration rollout va rollback/roll-forward exercise.

**Done:** matching sifati oldindan kelishilgan dataset/metric bilan o‘lchanadi; operator failure’ni runbook orqali tiklay oladi.

## Prioritet qoidasi

Keyingi phase avvalgisining `Done` mezoni bajarilmasdan asosiy ish oqimiga aylanmaydi. Zarur security fix va kichik parallel research bundan mustasno, lekin ular `DEVLOG.md`da qayd qilinadi.
