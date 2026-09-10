# Loyiha holati

**Holat sanasi:** 2026-09-10  
**Umumiy status:** Active Development  
**Repository bosqichi:** UI prototip + backend MVP foundation + DDD/AI arxitektura migratsiyasi

## Qisqa xulosa

Backend modular monolith sifatida shakllangan. Asosiy business modullar, JWT/RBAC asosi, lifecycle policy’lar, transactional outbox/inbox va AI audit/resume proposal poydevori repositoryda mavjud. Frontend sahifalari mavjud, lekin asosiy oqimlar mock ma’lumotlarga bog‘langan. Shuning uchun loyiha end-to-end MVP yoki production deb belgilanmaydi.

## VERIFIED

### Backend

- NestJS API `auth`, `user`, `resume`, `job`, `application`, `company`, `agent` va `admin` modullariga bo‘lingan.
- JWT authentication va role guard global provider sifatida ulangan.
- Company approval, job lifecycle, application status va resume limit/processing qoidalari alohida domain policy fayllariga chiqarilgan.
- Application va company lifecycle o‘zgarishlarida business state va outbox event bitta database transaction ichida yoziladi.
- Outbox dispatcher claim, bounded retry va stale-claim recovery kodiga ega.
- Inbox consumer/message juftligi orqali idempotency poydevori mavjud.
- AI execution metadata va candidate tasdig‘ini talab qiluvchi resume extraction proposal oqimi uchun schema va kod mavjud.

### Frontend

- Next.js App Router asosida public, candidate, agent, company va admin route guruhlari mavjud.
- 30 ta `page.tsx` sahifa mavjud.
- Authentication UI backend `/auth/login` va `/auth/me` endpointlariga typed client orqali ulangan; JWT httpOnly cookie, local role hint esa middleware UX-gate sifatida ishlatiladi.
- Kamida 32 ta frontend fayl mock data import qiladi.

### Repository holati

- 2026-09-10 tekshiruvida 38 ta modified/untracked path mavjud edi.
- DDD policy, integration/outbox, AI governance, resume extraction va Prisma migration ishlari shu tugallanmagan worktree tarkibida.

## IN PROGRESS

- Joriy backend va schema o‘zgarishlarini barqarorlashtirish.
- DDD policy’larni application services bilan integratsiya qilish.
- Authorization’ni agent-company assignment va resource ownership darajasida kuchaytirish.
- Transactional outbox/inbox va AI governance foundation.
- Arxitektura va loyiha hujjatlarini yagona tizimga keltirish.

## PROPOSED / hali amalga oshirilmagan

- Application withdraw/status transition UI va qolgan mock candidate dashboard oqimlarini real API bilan ulash.
- Cookie asosidagi real authentication flow.
- Email verification va notification delivery.
- Queue transport, scheduler/worker va dead-letter/replay tooling.
- Private object storage upload/read/delete adapteri va malware scanning.
- Real AI parser/provider va embedding/matching execution.
- Critical user journey E2E testlari.
- Tasdiqlangan production deployment va operatsion runbooklar.

## UNKNOWN / BLOCKER

- Unit test va buildlar VERIFIED: dependency reinstall’dan keyin 18 test suite / 80 test passed, API build passed va web production build passed.
- Oldingi hang root sababi VERIFIED: macOS dataless `node_modules` fayllari TypeScript/Jest o‘qishini to‘xtatgan; `npm ci` bilan dependency tree qayta tiklandi.
- Local migration execution VERIFIED: local `.env` canonical Compose port `3306`ga moslashtirildi; Prisma local Docker MySQL’da 2 ta migration mavjudligini va database schema up to date ekanini tasdiqladi.
- Queue tanlovi va operatsion semantikasi: Bull yoki BullMQ, scheduler, retry, DLQ va shutdown.
- Storage provider, region, retention, deletion va malware-scanning siyosati.
- AI provider/model, OCR yo‘li, prompt/schema version, timeout va oylik budget.
- Production platform, region/residency, SLO, RPO, RTO va alert ownership.
- Backend full lint VERIFIED: API source lint 0 error bilan o‘tdi.
- Frontend auth integration VERIFIED: typed API client, CANDIDATE→USER role mapping, login/logout va session restore oqimi lintdan o‘tdi.
- Candidate application integration VERIFIED: apply form, `GET /application/me` history va loading/error/empty states build/lintdan o‘tdi.
- Agent company review integration VERIFIED: approval detail approve/reject actionlari backend `PATCH /api/company/:code/review` endpointiga typed client orqali ulangan va web build/lintdan o‘tgan.
- Dependency audit holati qarama-qarshi: `npm ci` 29 vulnerability qaytardi, ammo keyingi `npm audit --offline --json` cache report 0 ko‘rsatdi; online registry audit DNS sabab bajarilmadi. Authoritative online triage UNKNOWN.

## Holatni yangilash mezoni

Bu hujjat faqat quyidagilardan biri bilan yangilanadi:

- repository kodi yoki configuration o‘zgarsa;
- test/build natijasi kuzatilsa;
- architecture decision qabul qilinsa;
- deployment platform tasdiqlangan holat qaytarsa;
- loyiha egasi talab yoki cheklovni aniq tasdiqlasa.
