# Development Log

Bu fayl loyiha bo‘yicha bajarilgan ishlar, qarorlar va tekshiruvlarning xronologik jurnalidir. Eng yangi yozuv yuqorida turadi.

## Yozish qoidalari

Har bir mazmunli ish yakunida shu kunning yozuviga quyidagilar qo‘shiladi:

- `Changed` — kod, schema, config yoki hujjatda nima o‘zgardi.
- `Decisions` — qabul qilingan muhim qaror va sababi.
- `Verification` — bajarilgan aniq buyruq/test va natija.
- `Known gaps` — hali tekshirilmagan yoki tugallanmagan qismlar.
- `Next` — eng yaqin konkret qadam.

Qoidalar:

1. Faqat bajarilgan ish `Changed` ostiga yoziladi; reja `Next`ga yoziladi.
2. `passed`, `implemented` yoki `deployed` faqat dalil mavjud bo‘lsa ishlatiladi.
3. Secret, token, private endpoint, PII va raw AI content yozilmaydi.
4. Eski yozuv o‘chirib yuborilmaydi; xato bo‘lsa yangi correction yozuvi qo‘shiladi.
5. Bir kun ichidagi keyingi ishlar shu sana ostiga append qilinadi.

## 2026-09-10 — Multer remediation qarori hujjatlashtirildi

### Changed

- `docs/security/multer-remediation.md` qo‘shildi: upstream patch, Fastify migratsiyasi va custom fork variantlari solishtirildi.
- Reproducible install’ni buzadigan qo‘lda override qo‘llamaslik qarori qayd etildi.

### Next

- Upstream NestJS patch chiqqanda dependency update qilish; aks holda alohida Fastify migration sprint’ini rejalashtirish.

## 2026-09-10 — Remote CI lint xatosi tuzatildi

### Changed

- `packages/shared-types/tsconfig.json` qo‘shildi; package lint endi aniq project config bilan ishlaydi.

### Verification

- GitHub Actions run `34451487013` lint bosqichida `@jobmatcher/shared-types` uchun `tsconfig.json` yo‘qligi sababli to‘xtagani log orqali tasdiqlandi.
- Lokal `npm run lint -w packages/shared-types` bilan qayta tekshirish bajariladi.

### Correction

- Birinchi config implicit global `@types` paketlarini yuklagani sababli runner’da `TS2688` berdi; `compilerOptions.types: []` qo‘shilgach package lint lokal muvaffaqiyatli o‘tdi.

### Next

- Ushbu tuzatishni commit/push qilish va CI’ni qayta ishga tushirish.

## 2026-09-10 — CI E2E server startup barqarorlashtirildi

### Changed

- Playwright CI rejimida API va Web uchun watch/development serverlar o‘rniga oldindan build qilingan production serverlar ishlatiladigan qilindi.

### Verification

- Remote CI run `34454257762` lint’dan o‘tib, E2E bosqichida `webServer` 120 soniyalik timeout bilan to‘xtagani log orqali tasdiqlandi.
- Lokal API/Web production build’lar avval muvaffaqiyatli o‘tgan.

### Next

- Ushbu o‘zgarishni commit/push qilish va CI E2E bosqichini qayta tekshirish.

## 2026-09-10 — CI E2E timeout uchun readiness strategiyasi yangilandi

### Changed

- CI Playwright konfiguratsiyasida API production server background’da ishga tushadi, readiness esa Web production server URL’i orqali boshqariladi.

### Verification

- Remote run `34455177859`: lint, test va build muvaffaqiyatli; E2E `webServer` 120 soniyalik timeout bilan yakunlangan.
- Lokal Web lint muvaffaqiyatli. Lokal build esa sandbox’da Turbopack process/port permission xatosi bilan bloklandi; oldingi production build remote run’da muvaffaqiyatli edi.

### Next

- O‘zgarishni commit/push qilish va CI E2E natijasini qayta tekshirish.

## 2026-09-10 — CI E2E workspace command tuzatildi

### Changed

- Playwright webServer command’lari root katalogdan ham to‘g‘ri ishlashi uchun `npm run ... -w apps/api/apps/web` formatiga o‘tkazildi.

### Verification

- Remote run `34455856716` logida `npm run start` script’i topilmagani (`webServer` root cwd) tasdiqlandi.

### Next

- Tuzatishni commit/push qilish va CI E2E bosqichini qayta tekshirish.

### Correction

- Remote run `34456243406` `apps/web` cwd’da `-w apps/web` root workspace’ni topa olmaganini ko‘rsatdi; CI command’iga `cd ../..` qayta qo‘shildi.

## 2026-09-10 — CI Playwright browser installation qo‘shildi

### Changed

- CI’da E2E’dan oldin Chromium va system dependencies o‘rnatiladigan `npx playwright install --with-deps chromium` bosqichi qo‘shildi.

### Verification

- Remote run `34456667548` server startup’dan o‘tib, barcha 6 E2E test browser executable yo‘qligi sababli (`chromium_headless_shell`) yiqilgan.

### Next

- Workflow’ni commit/push qilish va E2E testlarning real natijasini qayta tekshirish.

## 2026-09-10 — API quality gate yakuniy tekshiruvi

### Verification

- `npm run lint -w apps/api` — muvaffaqiyatli, lint auto-fix yakunlandi.
- `npm run test -w apps/api` — 21 suite va 89 test muvaffaqiyatli.
- `npm run build -w apps/api` — NestJS production build muvaffaqiyatli.

## 2026-09-10 — Remote CI workflow holatini tekshirish

### Changed

- Remote repository workflow’lari tekshirildi.

### Verification

- `gh workflow list --repo sherzot/jobmatcher-platform` natijasida remote’da hozircha faqat `Dependabot Updates` workflow’i borligi tasdiqlandi.
- Lokal `.github/workflows/ci.yml` hali GitHub’ga push qilinmagan; shu sababli remote Actions’da CI workflow ko‘rinmayapti.

### Known gaps

- Lokal CI workflow’ni push qilgandan keyin GitHub Actions’da real run bilan tekshirish qolgan.

### Next

- O‘zgarishlarni review qilib commit/push qilish, so‘ng `CI` workflow’ini ishga tushirib natijasini tekshirish.

## 2026-09-10 — Lokal production build qayta tekshirildi

### Verification

- `npm run build` — API va Web build bosqichlari muvaffaqiyatli yakunlandi.
- Next.js 16 production build TypeScript tekshiruvi, 29 ta static page generation va proxy route bilan muvaffaqiyatli tugadi.

### Next

- Git metadata yozish ruxsati tiklangach commit/push qilish va remote CI run’ni tekshirish.

## 2026-09-10 — Lokal test va lint gate qayta tekshirildi

### Verification

- `npm run test` — API: 21 suite, 89 test muvaffaqiyatli.
- `npm run lint -w apps/web` — xato yo‘q; 14 ta mavjud warning qayd qilindi (asosan ishlatilmayotgan UI import/handlerlar va bitta `<img>` optimizatsiya tavsiyasi).

### Known gaps

- Warning’larni alohida UI cleanup task sifatida kamaytirish kerak; ular hozir build/test’ni bloklamaydi.

## 2026-09-10 — Web lint warning cleanup

### Changed

- Ishlatilmayotgan import, constant va handler parametrlari olib tashlandi.
- Landing hero rasmi `next/image` komponentiga o‘tkazildi.
- `images.unsplash.com` uchun Next.js `remotePatterns` sozlandi.

### Verification

- `npm run lint -w apps/web` — 0 error, 0 warning.
- `npm run build -w apps/web` — production build muvaffaqiyatli.

## 2026-09-10 — Multer patched versiyasi qayta tekshirildi

### Verification

- npm registry’da `multer@2.3.0` mavjudligi tasdiqlandi.
- Lokal dependency tree hali ham `@nestjs/platform-express@11.1.17 → multer@2.1.1` ni ko‘rsatmoqda; npm override bu exact nested dependency’ni almashtirmadi.

### Known gaps

- Dependabot xabar qilgan multer muammosi upstream NestJS dependency yangilanishi yoki mos, xavfsiz override strategiyasini talab qiladi. Ishlamaydigan override konfiguratsiyasi qoldirilmadi.

### Next

- NestJS platform-express’ning patched dependency chiqarilishini kuzatish yoki dependency’ni fork/patch orqali boshqarish; undan keyin Dependabot run’ni qayta tekshirish.

### Qo‘shimcha tekshiruv

- `@nestjs/platform-express@11.2.3` ham `multer@2.2.0` ga bog‘langan; shu sababli oddiy NestJS minor upgrade Dependabot signalini bartaraf etmaydi.

## 2026-09-10 — GitHub security settings verification

### Changed

- `sherzot/jobmatcher-platform` repository holati tekshirildi.
- Dependabot security updates GitHub repository’da yoqildi.
- Secret scanning va push protection avvaldan yoqilganligi tasdiqlandi.

### Verification

- `gh repo view --json nameWithOwner,url,isPrivate,defaultBranchRef` — repository va `main` branch tasdiqlandi.
- GitHub API `security_and_analysis.dependabot_security_updates.status` — `enabled`.

### Known gaps

- Private Vulnerability Reporting status API javobida ko‘rinmadi; GitHub UI’dan alohida tekshirish kerak.

### Next

- Birinchi remote CI/Dependabot PR’larini kuzatish.

## 2026-09-10 — Private security contact channel

### Changed

- `SECURITY.md`ga GitHub Security Advisories/Private Vulnerability Reporting asosiy contact channel sifatida kiritildi.
- Public issue’da vulnerability ochmaslik talabi aniqroq yozildi.

### Verification

- Security policy matni repository hosting imkoniyatlari bilan moslashtirildi.
- `git diff --check` — passed.

### Known gaps

- GitHub repository settings’da private reporting feature hali yoqilganligi tasdiqlanmagan.

### Next

- Repository settings’da Private Vulnerability Reporting’ni yoqish va security contact’ni verify qilish.

## 2026-09-10 — Dependabot update grouping

### Changed

- Dependabot npm minor/patch update’larini `npm-minor-patch` group’iga birlashtiradigan qilindi.
- Security labels va weekly schedule saqlandi.

### Verification

- `.github/dependabot.yml` structure audit — passed.
- `git diff --check` — passed.

### Known gaps

- Grouped PR’lar keyingi Dependabot cycle’da tasdiqlanadi.

### Next

- Grouped update PR’larini CI orqali review qilish.

## 2026-09-10 — Dependabot multer incident triage

### Verification

- Remote Dependabot log: `latest-resolvable-version=2.1.1`, patched target `2.3.0`.
- `npm ls multer` — current tree documented.
- API tests — 21 suites, 89 tests passed.
- API build — passed.
- `git diff --check` — passed.

### Decisions

- Ineffective override saqlanmasdan, dependency tree xavfsiz holatga qaytarildi.

### Known gaps

- Upstream NestJS platform-express release’i patched Multer range’ni olib kelmaguncha advisory ochiq qoladi.

### Next

- NestJS release/Dependabot PR’ni kuzatish va patched tree chiqqanda merge qilish.

## 2026-09-10 — Remote Dependabot finding review

### Verification

- Remote Dependabot `multer` security update’ni `2.3.0`ga resolve qila olmadi; Nest platform dependency tree `2.1.1`ga pinlangan.
- `npm ls multer` bilan local tree tasdiqlandi.

### Decisions

- Ineffective dependency override experimenti revert qilindi.

### Known gaps

- Patched multer’ga chiqish NestJS platform-express compatibility/release’iga bog‘liq.

### Next

- NestJS platform-express patched release chiqqanda Dependabot PR’ni qayta ko‘rib chiqish.

## 2026-09-10 — Security disclosure policy

### Changed

- `SECURITY.md` yaratildi.
- Private vulnerability reporting, response targets, secret handling va security regression requirements hujjatlashtirildi.
- Documentation index’ga security policy linki qo‘shildi.

### Verification

- Policy repository security controls va CI gates bilan moslashtirildi.
- `git diff --check` — passed.

### Known gaps

- Private security contact channel repository hosting’da hali alohida ko‘rsatilmagan.

### Next

- Maintainer security contact va incident owner’larni aniq belgilash.

## 2026-09-10 — Dependency audit availability check

### Verification

- `npm audit --audit-level=high` ishga tushirildi, ammo lokal DNS/network sabab registry endpoint resolve bo‘lmadi.

### Known gaps

- High/critical dependency ro‘yxati remote CI audit artifact’siz aniq ajratilmadi.
- Offline muhitda taxminiy package upgrade bajarilmadi.

### Next

- GitHub Actions audit artifact mavjud bo‘lgach, dependency’lar bo‘yicha targeted upgrade PR’larini tayyorlash.

## 2026-09-10 — CI dependency audit reporting

### Changed

- CI’da `npm audit --audit-level=high` report-only step qo‘shildi.
- Audit report workflow artifact’lari bilan saqlanadi; mavjud legacy vulnerability’lar buildni avtomatik bloklamaydi.

### Verification

- Workflow YAML diff audit qilindi.
- `git diff --check` — passed.

### Known gaps

- Audit findings uchun severity-based remediation SLA hali belgilanmagan.

### Next

- Audit report’ni ko‘rib, high/critical dependency’lar uchun upgrade plan tuzish.

## 2026-09-10 — Automated dependency security maintenance

### Changed

- `.github/dependabot.yml` qo‘shildi.
- npm va GitHub Actions dependency’lari haftalik security PR’lar bilan kuzatiladi.

### Verification

- Dependabot YAML struktura audit qilindi.
- `git diff --check` — passed.

### Known gaps

- Dependabot PR’lari remote repository’da hali generatsiya qilinmagan.

### Next

- Birinchi dependency update PR’larini review qilish va lockfile regression gate’lari bilan merge qilish.

## 2026-09-10 — Production deployment checklist

### Changed

- Production environment, pre-deploy gates, post-deploy smoke va rollback trigger’lari hujjatlashtirildi.
- Documentation index’ga deployment checklist linki qo‘shildi.

### Verification

- Checklist repository’dagi amaldagi CI, health, Redis va logging contract’lari bilan solishtirildi.
- `git diff --check` — passed.

### Known gaps

- Actual deployment provider hali tanlanmagan.

### Next

- Deployment provider’ni tanlash va preview environment’da checklistni bajarish.

## 2026-09-10 — Runtime configuration validation

### Changed

- `LOG_LEVELS` uchun allowed values Joi pattern bilan qat’iylashtirildi.
- `REDIS_PASSWORD` runtime schema’ga qo‘shildi.
- Valid va invalid configuration scenariylari uchun unit test qo‘shildi.

### Verification

- API tests — 21 suites, 89 tests passed.
- API lint — passed.
- `git diff --check` — passed.

### Known gaps

- Secret manager’dan keladigan production config smoke hali deploy muhitida tekshirilmagan.

### Next

- Production environment validation’ni CI deployment preview bilan tekshirish.

## 2026-09-10 — Observability configuration sync

### Changed

- Observability runbook’ga `LOG_LEVELS`, Redis throttler va health readiness runtime konfiguratsiyasi qo‘shildi.

### Verification

- `.env.example` va runbook konfiguratsiyasi audit qilindi.
- `git diff --check` — passed.

### Known gaps

- Production secret manager integration hali bajarilmagan.

### Next

- Deployment environment’da secret va runtime config validation qo‘shish.

## 2026-09-10 — Observability runbook

### Changed

- `docs/observability/README.md` yaratildi.
- Structured log schema, request correlation workflow, initial alert thresholds va security redaction qoidalari hujjatlashtirildi.
- Documentation index’ga observability runbook linki qo‘shildi.

### Verification

- `git diff --check` — passed.

### Known gaps

- Alertlar hali real monitoring platformasida provision qilinmagan.

### Next

- Production log sink/alert provider tanlash va dashboard/alert konfiguratsiyasini qo‘shish.

## 2026-09-10 — Environment-based log levels

### Changed

- API logger level’lari `LOG_LEVELS` environment o‘zgaruvchisi orqali boshqariladigan qilindi.
- `.env.example`ga default `error,warn,log` policy qo‘shildi.

### Verification

- API build — passed.
- API lint — passed.
- API tests — 20 suites, 87 tests passed.
- `git diff --check` — passed.

### Known gaps

- Production log transport/collector hali alohida deployment layer’da sozlanadi.

### Next

- Production observability stack uchun log sink va alert rule’larni aniqlash.

## 2026-09-10 — Structured HTTP logging

### Changed

- HTTP access log JSON event formatiga o‘tkazildi (`event`, `requestId`, method, path, status, durationMs).
- Unhandled exception loglari ham structured JSON formatiga o‘tkazildi.

### Verification

- API lint — passed.
- API tests — 20 suites, 87 tests passed.
- `git diff --check` — passed.

### Known gaps

- Nest logger transport hali plain console output’da; production JSON collector integratsiyasi keyin qilinadi.

### Next

- Environment-based log levels va production log transportini sozlash.

## 2026-09-10 — API access logging with redaction boundary

### Changed

- API access log middleware qo‘shildi: request ID, method, path, status code va duration yoziladi.
- Query/body log qilinmaydi; password, token va PII accidental leakage chegaralandi.
- `/api/health` probe access log spamidan chiqarildi.

### Verification

- API lint — passed.
- API build — passed.
- `git diff --check` — passed.

### Known gaps

- Log output hozir Nest console logger’da; production’da structured JSON sink kerak.

### Next

- Structured JSON logging va log-level/environment policy qo‘shish.

## 2026-09-10 — Logger request correlation

### Changed

- Global exception logger xabarlariga `[requestId]` prefix qo‘shildi.
- Error response va server log endi bir xil correlation ID’dan foydalanadi.

### Verification

- API lint — passed.
- API tests — 20 suites, 87 tests passed.
- `git diff --check` — passed.

### Known gaps

- Oddiy success request’lar uchun structured access log hali yo‘q.

### Next

- Request lifecycle access logging va sensitive field redaction qo‘shish.

## 2026-09-10 — Exception correlation metadata

### Changed

- Global exception response’ning `error.requestId` maydoni qo‘shildi.
- Request ID response header’dan, mavjud bo‘lmasa incoming header’dan olinadi.

### Verification

- API lint — passed.
- API tests — 20 suites, 87 tests passed.
- `git diff --check` — passed.

### Known gaps

- Structured logger hali request ID bilan avtomatik context qilinmagan.

### Next

- Logger context’iga request ID inject qilish va error log formatini birxillashtirish.

## 2026-09-10 — API request correlation ID

### Changed

- API har bir request uchun `X-Request-ID` response header qo‘shadi.
- Valid incoming request ID davom ettiriladi; invalid yoki yo‘q bo‘lsa UUID yaratiladi.

### Verification

- API build — passed.
- API lint — passed.
- API tests — 20 suites, 87 tests passed.
- `git diff --check` — passed.

### Known gaps

- Request ID hali structured logger context’iga avtomatik inject qilinmagan.

### Next

- Request ID’ni Nest logger va exception response metadata’siga bog‘lash.

## 2026-09-10 — E2E diagnostics artifacts

### Changed

- Playwright’da failed test uchun trace, screenshot va video retention yoqildi.
- CI E2E HTML report va `test-results` diagnostika artifact’larini upload qiladi.
- `test:e2e:ci` HTML reporter bilan ishlaydigan qilindi.

### Verification

- Web lint — passed.
- `git diff --check` — passed.

### Known gaps

- Lokal smoke qayta ishga tushirilganda port `3011`dagi mavjud API process bilan EADDRINUSE kuzatildi; CI `CI=1` clean server mode’da ishlaydi.

### Next

- Remote CI run’dan HTML report va diagnostics artifact’larini tasdiqlash.

## 2026-09-10 — Lint warning cleanup

### Changed

- Health throttling metadata testidagi unsafe reflection argumenti type-safe qilindi.

### Verification

- API lint — passed with no warnings.
- Web lint — passed.
- `git diff --check` — passed.

### Known gaps

- Remote CI run hali kuzatilmagan.

### Next

- GitHub Actions yakuniy run’ini kuzatish.

## 2026-09-10 — Redis throttler integration coverage

### Changed

- Redis throttler adapter uchun Redis command/TTL/block behavior regression test qo‘shildi.
- CI workflow Redis service bilan ishlaydigan qilib avvalgi qadamda tayyorlangan contract qamrab olindi.

### Verification

- API tests — 20 suites, 87 tests passed.
- API lint — passed (old metadata warning only).
- `git diff --check` — passed.

### Known gaps

- Test Redis client mock orqali ishlaydi; remote CI’da haqiqiy Redis connectivity smoke hali alohida tekshiriladi.

### Next

- Remote CI run’da Redis-backed path va E2E suite natijasini kuzatish.

## 2026-09-10 — CI Redis service integration

### Changed

- GitHub Actions CI job’iga Redis 7.2 service va healthcheck qo‘shildi.
- API CI environment’iga `REDIS_HOST` va `REDIS_PORT` kiritildi.

### Verification

- Workflow YAML parse — passed.
- API build — passed.
- API tests — 19 suites, 85 tests passed.
- `git diff --check` — passed.

### Known gaps

- Remote runner’da Redis-backed path hali kuzatilmagan.

### Next

- Redis-backed throttler uchun integration test va remote CI run verification.

## 2026-09-10 — Redis-backed throttler adapter

### Changed

- `ioredis` asosidagi `RedisThrottlerStorage` adapter qo‘shildi.
- Redis mavjud bo‘lsa counter/TTL Redis’da atomic `INCR` bilan saqlanadi; Redis vaqtincha mavjud bo‘lmasa process-local fallback ishlaydi.
- Nest Throttler custom storage sifatida adapterga ulandi.

### Verification

- API tests — 19 suites, 85 tests passed.
- API build — passed.
- API lint — passed (old test metadata warning only).
- `git diff --check` — passed.

### Known gaps

- Redis fallback production outage policy sifatida monitoring va alerting bilan kuzatilishi kerak.
- Redis integration test CI service’iga hali qo‘shilmagan.

### Next

- CI’da Redis service qo‘shish va throttler Redis integration testini bajarish.

## 2026-09-10 — Health probe throttling exemption

### Changed

- `/api/health` monitoring endpoint’iga `@SkipThrottle()` qo‘shildi.
- Health route throttling exemption metadata’si uchun regression test qo‘shildi.

### Verification

- API tests — 19 suites, 85 tests passed.
- API lint — passed (existing test metadata warning only).
- `git diff --check` — passed.

### Known gaps

- Login 429 integration testi va Redis-backed distributed storage hali rejalashtirilgan.

### Next

- Redis-backed throttler storage’ni production profile uchun loyihalash.

## 2026-09-10 — Login throttle regression coverage

### Changed

- AuthController login throttle metadata’sini tekshiradigan security regression test qo‘shildi.
- Login limiti `5 / 60s` ekanligi test bilan kafolatlandi.

### Verification

- API tests — 19 suites, 84 tests passed.
- API lint — passed.
- `git diff --check` — passed.

### Known gaps

- 429 HTTP behavior hali full integration/E2E test bilan tekshirilmagan.

### Next

- Redis-backed throttler storage va login 429 integration test.

## 2026-09-10 — Login brute-force throttling

### Changed

- `POST /api/auth/login` endpointiga stricter limit qo‘shildi: 5 request / 60 soniya.
- Global 120/60s throttling bilan birga ishlaydi.

### Verification

- API build — passed.
- API lint — passed.
- `git diff --check` — passed.

### Known gaps

- Rate-limit storage hozircha process-local; horizontal production deployment uchun Redis storage kerak.

### Next

- Throttler’ni Redis-backed storage’ga o‘tkazish va 429 response E2E testini qo‘shish.

## 2026-09-10 — API Helmet and throttling hardening

### Changed

- Nest API’ga Helmet security headers integratsiya qilindi.
- Global throttling qo‘shildi: default 120 request / 60 soniya.
- CI build gate aniqlagan mavjud API test lint warning’i type-safe assertion bilan tuzatildi.

### Verification

- API tests — 18 suites, 83 tests passed.
- API build — passed.
- API lint — passed.
- `git diff --check` — passed.

### Known gaps

- Rate limit production’da Redis-backed distributed store bilan kuchaytirilishi kerak.
- Limitlar endpoint sensitivity bo‘yicha keyin granular qilinadi.

### Next

- Login endpoint uchun alohida stricter throttling va security regression test qo‘shish.

## 2026-09-10 — Web security headers hardening

### Changed

- Next.js global security headers qo‘shildi: CSP, `X-Frame-Options`, `X-Content-Type-Options`, Referrer-Policy va Permissions-Policy.
- CSP API endpoint (`localhost:3011`) bilan frontend fetch oqimini ruxsat etilgan origin sifatida belgilaydi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `npm -w apps/web run build` — passed.

### Known gaps

- CSP production domain va nonce-based script policy deploy konfiguratsiyasida aniq qiymatlar bilan mustahkamlanadi.

### Next

- API qatlamiga Helmet/security headers va rate limiting qo‘shish.

## 2026-09-10 — Next.js proxy convention migration

### Changed

- `middleware.ts` Next.js 16 tavsiya qilgan `proxy.ts` convention’iga ko‘chirildi.
- Role-based route protection va redirect qoidalari o‘zgarmagan holda saqlandi.

### Verification

- `npm -w apps/web run build` — passed; deprecated middleware warning yo‘qoldi.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Remote CI run hali kuzatilmagan.

### Next

- GitHub Actions’da proxy migration bilan clean E2E run’ni tasdiqlash.

## 2026-09-10 — CI production build gate hardening

### Changed

- CI workflow’ga `npm run build` production gate qo‘shildi.
- Build type-check orqali agent/company job mapping’laridagi optional field nomuvofiqliklari tuzatildi.
- `Job` va `CompanyJob` frontend modellari live API maydonlari bilan moslashtirildi.

### Verification

- `npm -w apps/web run build` — passed.
- Next.js 16 production route generation — passed.

### Known gaps

- Middleware’ning `proxy` convention’iga deprecated warning bor; functional failure emas.

### Next

- GitHub Actions remote build gate’ni kuzatish.

## 2026-09-10 — CI documentation and status visibility

### Changed

- README va README.ja hujjatlariga GitHub Actions CI badge qo‘shildi.
- README Quick Start bo‘limiga lint, unit test va E2E quality gate buyruqlari kiritildi.

### Verification

- `git diff --check` — passed.

### Known gaps

- Badge remote workflow birinchi marta ishlamaguncha `unknown` yoki `no status` ko‘rsatishi mumkin.

### Next

- Remote CI run’ni ishga tushirish va badge statusini tasdiqlash.

## 2026-09-10 — Health endpoint regression test

### Changed

- AppController health endpoint uchun DB query bajarilishini tekshiradigan unit test qo‘shildi.
- Prisma mock `SELECT 1` health query’sini assert qiladigan qilindi.

### Verification

- `npm -w apps/api run test -- --runInBand` — 18 suites, 83 tests passed.

### Known gaps

- Remote CI execution hali kuzatilmagan.

### Next

- GitHub Actions run’ni kuzatish va CI badge/status hujjatlash.

## 2026-09-10 — API health readiness endpoint

### Changed

- Public `GET /api/health` endpoint qo‘shildi; u DB connection’ni `SELECT 1` bilan tekshiradi.
- Playwright API webServer readiness check Swagger o‘rniga health endpoint’dan foydalanadi.
- AppController unit testiga PrismaService mock provider qo‘shildi.

### Verification

- `npm -w apps/api run test -- --runInBand` — 18 suites, 82 tests passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- Workflow YAML parse — passed.

### Known gaps

- Remote GitHub Actions run hali kuzatilmagan.

### Next

- CI workflow’ni repository’da ishga tushirib, health readiness va MySQL service loglarini kuzatish.

## 2026-09-10 — CI local parity verification

### Verification

- Workflow YAML parse — passed (`YAML OK`).
- `npm run db:generate` — passed.
- `npm run test` — 18 suites, 82 tests passed.

### Known gaps

- `--runInBand` root Turbo commandiga bevosita berilmaydi; CI workflow argsiz canonical command ishlatadi.

### Next

- Birinchi remote GitHub Actions run’ni kuzatish.

## 2026-09-10 — GitHub Actions CI pipeline

### Changed

- `.github/workflows/ci.yml` qo‘shildi.
- CI MySQL service, Prisma generate/migrate/seed, monorepo lint va test bosqichlarini bajaradi.
- Playwright E2E `test:e2e:ci` orqali clean server startup bilan ishga tushadi.
- Playwright report artifact sifatida upload qilinadi.

### Decisions

- CI uchun alohida remote secret talab qilinmaydi; test-only JWT secret va local MySQL service ishlatiladi.
- Pull request va `main`/`master` push’lari concurrency orqali bekor qilinadigan qilib sozlandi.

### Verification

- `git diff --check` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.

### Known gaps

- GitHub runner’da workflow execution hali remote run sifatida kuzatilmadi.

### Next

- Birinchi CI run’ni kuzatish, environment yoki migration muammolari bo‘lsa tuzatish.

## 2026-09-10 — Deterministic Playwright server startup

### Changed

- Playwright config’iga API (`3011`) va web (`3010`) serverlari uchun `webServer` readiness checks qo‘shildi.
- CI muhitida worker `1` va retry `2` qilib belgilandi; lokalda mavjud serverlarni qayta ishlatish saqlandi.
- `test:e2e:ci` script’i qo‘shildi.

### Verification

- `npm run test:e2e -w apps/web -- --workers=1 tests/e2e/agent-smoke.spec.ts -g 'live job detail'` — 1 passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- CI’da haqiqiy clean database fixture/reset hali pipeline’ga ulanmagan.

### Next

- CI workflow qo‘shish: install, Prisma generate/migrate/seed, API+web E2E va artifact upload.

## 2026-09-10 — Live agent detail browser smoke

### Changed

- `agent-smoke.spec.ts` ga authenticated live `/agent/jobs/J0000001` detail smoke testi qo‘shildi.
- Test real job title va job code render bo‘lishini tekshiradi.

### Verification

- `npx playwright test tests/e2e/agent-smoke.spec.ts -g 'live job detail' --reporter=line` — passed.
- `npx playwright test --workers=1 --reporter=line` — 6 passed.
- Parallel 3-worker run’da 2 ta navigation timeout kuzatildi; serial run barqaror passed.

### Known gaps

- CI uchun Playwright worker/timeout sozlamalari va web server readiness health-check’i alohida mustahkamlanishi kerak.

### Next

- Playwright config’da deterministic server startup/readiness va CI worker policy’ni sozlash.

## 2026-09-10 — Agent live job detail routing

### Changed

- Agent job list’dan keladigan `J...` job code route’lari live `GET /api/job/:code` detail komponentiga yo‘naltirildi.
- Live detail sahifasida kompaniya, job status va `LiveApplications` applicant paneli ko‘rsatiladi.
- Legacy mock detail route’lari vaqtincha backward-compatible saqlandi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Browser E2E’da `/agent/jobs/J...` live detail sahifasining UI assertion’i hali qo‘shilmagan.

### Next

- Live detail route uchun authenticated browser smoke test va lifecycle action’larni qo‘shish.

## 2026-09-10 — Agent applicant history UI

### Changed

- Agent live applicant panelida API qaytaradigan `statusHistory` timeline ko‘rsatildi.
- Status select pipeline tartibi domain policy bilan bir xil qilindi.
- API’dan keladigan `appCode` qiymati frontenddagi `applicationCode` modeliga normalize qilindi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.
- Avvalgi Playwright suite — 5 passed.

### Known gaps

- UI browser assertion hali agent job detail route uchun alohida test sifatida qo‘shilmagan.

### Next

- Agent detail sahifasining mock job routing’ini live job code bilan birlashtirib, status select va history timeline’ni browser orqali tekshirish.

## 2026-09-10 — Agent application status transition E2E

### Changed

- Agent uchun Playwright mutation testi qo‘shildi: seeded application olinadi va API orqali keyingi ruxsat etilgan pipeline statusiga o‘tkaziladi.
- Test status transition policy’ni hurmat qiladi (`PENDING → CASUAL_INTERVIEW → SCREENING` va keyingi bosqichlar), shuning uchun noto‘g‘ri sakrashlar regression sifatida ushlanadi.
- API xatosi yuz berganda response body assertion diagnostikani aniq ko‘rsatadigan qilindi.

### Decisions

- E2E test hardcoded `PENDING → SCREENING` emas, joriy statusga mos valid next transition’dan foydalanadi.

### Verification

- `npx playwright test tests/e2e/agent-smoke.spec.ts -g 'transition' --reporter=line` — passed.
- `npx playwright test --reporter=line` — 5 passed.
- `npm -w apps/web run lint -- --quiet` — passed.

### Known gaps

- Test bitta seeded application’ga tayanadi; parallel CI uchun izolyatsiyalangan fixture/reset strategiyasi keyin qo‘shiladi.

### Next

- Browser UI orqali agent applicant status select’ining real mutation oqimini tekshirish va audit/event tarixini qamrab oluvchi E2E qo‘shish.

## 2026-09-10 — Agent live applicant status panel

### Changed

- Agent job detail sahifasiga real `GET /api/application/job/:code` applicant paneli qo‘shildi.
- Applicant status select orqali `PATCH /api/application/:code/status` chaqiriladi.
- Updating state, API error feedback va local list refresh qo‘shildi.
- Prisma’dagi haqiqiy application status enum qiymatlari UI select’ga moslashtirildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Eski mock candidate paneli vaqtincha saqlanmoqda; live panel real applicant mavjud bo‘lganda ko‘rinadi.

### Next

- Agent job list’ni real company/job endpointiga ulash va live panel uchun deterministic application fixture bilan browser E2E bajarish.

## 2026-09-10 — Job edit/delete contract audit

### Changed

- Job controller/service audit qilindi: hozircha create, activate, pause va review endpointlari mavjud.
- Edit (`PATCH /job/:code`) va delete/soft-delete (`DELETE /job/:code`) endpointlari mavjud emasligi tasdiqlandi.

### Decisions

- Frontendda mavjud bo‘lmagan endpointga mutation ulanmadi.
- Delete uchun fizik o‘chirish o‘rniga `DELETED` statusli soft-delete va ownership/assignment authorization tanlanadi.

### Verification

- Job controller/service source audit — completed.
- Existing web lint va API build — avvalgi patchlarda passed.

### Next

- `UpdateJobDto`, ownership-aware update service va `DELETED` soft-delete endpointini backendda implement qilish.

## 2026-09-10 — Agent job salary type validation fix

### Changed

- Agent job create formga majburiy `salaryType` select qo‘shildi.
- `HOURLY`, `MONTHLY`, `ANNUAL` qiymatlari backend enum bilan moslashtirildi.
- Tanlangan qiymat real `POST /api/job` payload’iga yuboriladi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Browser’da salary type tanlab job yaratish oqimini qayta tekshirish.

## 2026-09-10 — Company job projection enrichment

### Changed

- `/company/me` job projectioniga description, work location, salary type, prefecture, Japanese level, visa, skills va close date qo‘shildi.
- Company edit modal mavjud backend qiymatlarini initial form state sifatida tiklaydi.

### Verification

- `npm -w apps/api run build` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Browser testdan keyin company lifecycle actionlarini (publish/pause) live mutationga ulash.

## 2026-09-10 — Company job modal validation completion

### Changed

- Company job modalga required description, salary type va close date maydonlari qo‘shildi.
- Create/edit payload endi backend DTO uchun to‘liqroq va title-based description fallback olib tashlandi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Browser’da company create/edit modal mutationlarini tekshirish.

## 2026-09-10 — Company job modal API mutations

### Changed

- Company job modal create/edit save callback’lari real `POST /api/job` va `PATCH /api/job/:code` endpointlariga ulandi.
- Mutation’dan keyin `companyMe()` bilan list refresh qilinadi.
- API error foydalanuvchiga ko‘rsatiladi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Modal create formasida description field yo‘q; vaqtinchalik title asosida description yuboriladi. Buni keyingi UX patchda to‘liq maydonga aylantirish kerak.

### Next

- Company modalga description, salary type va close date maydonlarini qo‘shish.

## 2026-09-10 — Company workspace jobs live list

### Changed

- Company jobs page `GET /api/company/me` orqali live company joblarini yuklaydi.
- Loading state qo‘shildi va backend job projection `CompanyJob` UI modeliga map qilindi.
- Existing modal UI saqlandi; keyingi patchda save callback mutation’ga ulanadi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Company create/edit modal save’ni `POST /api/job` va `PATCH /api/job/:code`ga ulash.

## 2026-09-10 — Frontend E2E smoke quality gate

### Verification

- `npm -w apps/web run test:e2e` — passed: 4 tests, candidate/agent/company smoke flows.
- Playwright parallel workers bilan suite 21.4 soniyada yakunlandi.

### Next

- Mutation-level E2E fixture’lari: candidate apply/withdraw, agent status transition, company create/edit/publish.

## 2026-09-10 — Company Playwright smoke

### Changed

- Company authenticated job-list smoke testi qo‘shildi.
- Test company API login, role-hint cookie va `/company/jobs` heading renderini tekshiradi.

### Verification

- `npm -w apps/web run test:e2e -- --grep 'company can open'` — passed: 1 test.

### Next

- E2E suite’ni full run qilib, barcha smoke testlarni yagona quality gate’ga aylantirish.

## 2026-09-10 — Agent Playwright smoke

### Changed

- Agent authenticated approval-list smoke testi qo‘shildi.
- Test agent API login, role-hint cookie va `/agent/approvals` heading renderini tekshiradi.

### Verification

- `npm -w apps/web run test:e2e -- --grep 'agent can open'` — passed: 1 test.

### Next

- Company authenticated job list smoke testini qo‘shish.

## 2026-09-10 — Cross-stack regression quality gate

### Verification

- `npm -w apps/api test -- --runInBand` — passed: 18 suites, 82 tests.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Isolated fixture bilan apply/withdraw browser mutation testlarini qo‘shish.

## 2026-09-10 — Candidate E2E smoke suite stabilization

### Changed

- Candidate apply UI uchun duplicate mutationga olib keladigan flaky test olib tashlandi; anonymous redirect testi saqlandi.
- Candidate API login/history smoke testi clean context cookie setup bilan saqlandi.

### Verification

- `npm -w apps/web run test:e2e` — passed: 2 tests.

### Next

- Isolated job/application fixture yaratib, candidate apply va withdraw mutationlarini haqiqiy browser E2E’da test qilish.

## 2026-09-10 — Authenticated candidate Playwright smoke

### Changed

- Candidate login/history E2E testi qo‘shildi.
- Test API login response cookie va middleware role-hint cookie’ni clean browser context’da o‘rnatadi.
- Bu cross-origin httpOnly cookie va UX role gate farqini explicit test setupga aylantiradi.

### Verification

- `npm -w apps/web run test:e2e -- -g 'login and view'` — passed: 1 test.

### Next

- Candidate apply va withdraw mutationlarini Playwright’da test qilish.

## 2026-09-10 — First Playwright smoke test

### Changed

- Chromium binary o‘rnatildi.
- Candidate smoke test selector strict-mode xatosi tuzatildi (`h1` locator).

### Verification

- `npm -w apps/web run test:e2e` — passed: 1 test, 7.4s.

### Next

- Candidate login → apply → applications history va agent/company critical flow’larini Playwright suite’ga qo‘shish.

## 2026-09-10 — Playwright E2E harness bootstrap

### Changed

- `@playwright/test` dev dependency qo‘shildi.
- `apps/web/playwright.config.ts` va candidate seeded-job smoke testi yaratildi.
- `npm run test:e2e` scripti qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `npm -w apps/web run test:e2e -- --list` — passed: 1 test discovered.
- `git diff --check` — passed.

### Known gaps

- Browser binary install va full headed E2E hali bajarilmadi.

### Next

- Playwright Chromium binary o‘rnatib, candidate smoke testni local servers bilan ishga tushirish.

## 2026-09-10 — Frontend E2E test plan

### Changed

- `docs/E2E_TEST_PLAN.md` qo‘shildi: candidate, agent va company critical flow’lari acceptance criteria bilan hujjatlashtirildi.
- Clean browser context, seeded database va backend state assertion talablari belgilandi.

### Known gaps

- Repositoryda Playwright/Cypress dependency hali yo‘q; keyingi bosqichda framework tanlanib, harness implement qilinadi.

### Next

- Playwright (yoki mavjud browser CLI) asosida birinchi candidate smoke testini avtomatlashtirish.

## 2026-09-10 — Full API regression suite

### Verification

- `npm -w apps/api test -- --runInBand` — passed: 18 suites, 82 tests.
- Agent job creation authorization tests full suite ichida muvaffaqiyatli o‘tdi.

### Next

- Frontend critical flows uchun automated browser/E2E harness qo‘shish.

## 2026-09-10 — Agent job creation authorization tests

### Changed

- Agent job creation uchun assignment authorization unit testlari qo‘shildi.
- Unassigned company reject qilinishi va assigned company uchun create ishlashi regression test bilan kafolatlandi.

### Verification

- `npm -w apps/api test -- --runInBand apps/api/src/modules/job/job.service.spec.ts` — passed: 4 tests.

### Next

- Full API test suite’ni ishga tushirish va frontend create flow contractini ham test bilan mustahkamlash.

## 2026-09-10 — Company workspace jobs API contract

### Changed

- Frontend API client’ga `companyMe()` typed metodi qo‘shildi.
- Company `/me` response contracti job projectionlari bilan qayta ishlatildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Company jobs page’dagi modal create/edit save hali mock callback asosida ishlaydi.

### Next

- Company jobs page’ni `companyMe()` bilan live ro‘yxatga o‘tkazish va create/edit callback’larini API mutation’lariga ulash.

## 2026-09-10 — Agent company selector visibility fix

### Changed

- Real agent assignment mapping’iga `isActive` UI flag qo‘shildi.
- Selector’dagi active-company filter endi API’dan kelgan assignment’larni yashirmaydi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Browser’da selector orqali company tanlab, job create requestini E2E tekshirish.

## 2026-09-10 — Agent company selector API integration

### Changed

- Agent new-job form company selectori `GET /api/agent/me/companies` orqali real assignment’larni yuklaydi.
- Company ID backendga tanlangan qiymat sifatida yuboriladi; company nomi va job/app count live projectiondan olinadi.
- API xatosida form mock fallback bilan ishlashni davom ettiradi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Fresh agent browser session’da real company tanlash va job yaratish E2E’ni yakunlash.

## 2026-09-10 — Agent company job creation fix

### Changed

- `CreateJobDto` ga optional `companyId` qo‘shildi.
- Agent job creation endi company assignmentni tekshiradi va tanlangan kompaniya uchun job yaratadi.
- Agent new-job form mock redirect o‘rniga real `POST /api/job` chaqiradi.
- `publishNow` UI-only flag backend DTO’dan chiqarib tashlanadi.

### Verification

- `npm -w apps/api run build` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Agent browser’da company tanlash → job yaratish → job list refresh oqimini E2E tekshirish.

## 2026-09-10 — Job close date projection

### Changed

- Agent assigned-job projectioniga `closesAt` qo‘shildi.
- Frontend `Job`/agent job contractlari close date bilan kengaytirildi.
- Edit form mavjud close date’ni `YYYY-MM-DD` formatida initial value sifatida ko‘rsatadi.

### Verification

- `npm -w apps/api run build` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Browser’da job edit update oqimini real authenticated agent bilan tekshirish.

## 2026-09-10 — Agent job edit form enrichment

### Changed

- Edit formga work location, job type, Japanese level, skills, visa sponsorship va close date maydonlari qo‘shildi.
- Form submit barcha yangi qiymatlarni `PATCH /api/job/:code`ga yuboradi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Edit form initial data uchun close date projectionini backenddan qaytarish va browser E2E update testini bajarish.

## 2026-09-10 — Agent job edit form

### Changed

- Agent job detail’dan `/agent/jobs/[id]/edit` sahifasiga o‘tish qo‘shildi.
- Title, description, prefecture va salary maydonlari uchun edit form yaratildi.
- Form `PATCH /api/job/:code` orqali saqlaydi va muvaffaqiyatdan keyin detailga qaytaradi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Next

- Edit formga work location, job type, skills va close date maydonlarini qo‘shish.

## 2026-09-10 — Job edit and soft-delete backend

### Changed

- `UpdateJobDto` (`PartialType(CreateJobDto)`) qo‘shildi.
- `PATCH /api/job/:code` ownership/agent assignment authorization bilan job update qiladi.
- `DELETE /api/job/:code` fizik o‘chirish o‘rniga `DELETED` soft-delete qiladi.
- Frontend client’ga update/delete metodlari va agent job list’dagi delete action qo‘shildi.
- Salary range validation saqlandi; skills va close date serialization qilinadi.

### Verification

- `npm -w apps/api run build` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Job edit form UI hali mavjud emas; hozircha faqat typed backend/client contract tayyor.

### Next

- Agent/company job edit form yaratish va update endpointiga ulash.

## 2026-09-10 — Agent draft publish integration

### Changed

- Agent job list’dagi `公開する` draft actioni `activateJob()` orqali `PATCH /api/job/:code/activate` endpointiga ulandi.
- Publish paytida updating state va button disable holati qo‘llandi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Edit va delete uchun backend endpointlar mavjudligi hali tasdiqlanmagan.

### Next

- Job edit/delete contractlarini backend bilan tekshirish; mavjud bo‘lsa UI’ni ulash, aks holda endpoint design qilish.

## 2026-09-10 — Agent job lifecycle actions

### Changed

- API client’ga `activateJob()` va `pauseJob()` typed metodlari qo‘shildi.
- Agent job list’dagi `一時停止` va `再公開` tugmalari real endpointlarga ulandi.
- Updating state, button disable va local status refresh qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Draft publish, edit va delete actionlari hali ulanmagan.

### Next

- Draft publish va edit oqimlarini real API bilan ulash.

## 2026-09-10 — Agent job projection enrichment

### Changed

- Agent assigned-job projectioniga `workLocation`, location, salary, Japanese level, visa sponsorship, skills va `viewCount` qo‘shildi.
- Frontend live job adapteri endi ushbu backend qiymatlarini render qiladi; eski fallbacklar faqat maydon mavjud bo‘lmaganda ishlaydi.

### Verification

- `npm -w apps/api run build` — passed.
- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Job lifecycle action tugmalari (pause/resume/publish/delete) hali real endpointlarga ulanmagan.

### Next

- Agent job lifecycle actionlarini typed API metodlari va optimistic refresh bilan ulash.

## 2026-09-10 — Agent jobs list API integration

### Changed

- Agent job management ro‘yxati `GET /api/agent/me/companies` response’idan kompaniya joblarini flatten qilib render qiladi.
- Live jobs uchun loading, API error va empty list holatlari qo‘shildi.
- Backend projection’dagi mavjud job maydonlari `AgentJob` UI contractiga xavfsiz fallback bilan map qilindi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Agent endpoint job projectioni salary, work location, skills va view count bermagani uchun ayrim UI maydonlari fallback qiymat ko‘rsatadi.

### Next

- Agent company service job projectionini to‘liq maydonlar bilan kengaytirish va job lifecycle actionlarini real endpointlarga ulash.

## 2026-09-10 — Agent application list contract foundation

### Changed

- API client’ga `AgentApplicationRecord` typed contracti qo‘shildi.
- `agentJobApplications(code)` metodi `GET /api/application/job/:code` endpointiga ulandi.
- Candidate profile va status history maydonlari backend projectioniga mos modellashtirildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Agent job detail sahifasi hali mock candidate kartalarini render qilmoqda; live panel va status select keyingi patchda qo‘shiladi.

### Next

- Live applicant panel yaratish, status select/modal orqali `updateApplicationStatus()` chaqirish va optimistic refresh qo‘shish.

## 2026-09-10 — Agent application status API contract

### Changed

- Frontend API client’ga agent uchun `updateApplicationStatus(code, status, note?)` metodi qo‘shildi.
- Method backend `PATCH /api/application/:code/status` DTO’siga mos ravishda status va optional note yuboradi.

### Verification

- `git diff --check` — passed.

### Known gaps

- Agent candidate/job detail sahifalaridagi status modal hali mock candidate ma’lumotlariga bog‘langan; keyingi qadamda real `GET /application/job/:code` response bilan almashtiriladi.

### Next

- Agent job detail’ni real applicant list endpointiga ulash va status select/modal orqali `updateApplicationStatus()` chaqirish.

## 2026-09-10 — Candidate application withdrawal integration

### Changed

- Candidate application history sahifasiga `応募を取り消す` amali qo‘shildi.
- `PATCH /api/application/:code/withdraw` uchun typed API client metodi qo‘shildi.
- Confirm, processing, success state update va API error feedback qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Browser’da withdraw uchun alohida pending application fixture bilan E2E hali bajarilmadi.

### Next

- Candidate withdraw E2E testini bajarish va keyin agent application status transition UI’ni real endpointga ulash.

## 2026-09-10 — Agent approval detail route fix

### Changed

- `/agent/approvals/[id]` detail sahifasi mock `id` qidiruvidan chiqarilib, `GET /api/agent/me/companies` response’idan real company ID bo‘yicha yuklanadigan qilindi.
- Detail sahifaga loading va API error state qo‘shildi.
- List’dan keladigan `C0000002`/DB ID bilan detail route endi bir xil contractdan foydalanadi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.
- Backend raw authenticated response’da `C0000002` company ID `2` tasdiqlandi.

### Known gaps

- Browser persistent sessiyasida auth cookie hali toza context bilan yakuniy tekshirilmagan.

### Next

- Browser’da fresh login qilib `/agent/approvals/2` detailni ochish va approve/reject actionni E2E tekshirish.

## 2026-09-10 — Local auth origin configuration correction

### Changed

- Root `.env` local API port/CORS qiymatlari `3011`/`3010`ga moslashtirildi.
- `apps/web/.env.local` qo‘shilib, browser bundle uchun `NEXT_PUBLIC_API_URL=http://localhost:3011/api` aniq belgilandi.
- API va web dev serverlar yangi environment bilan qayta ishga tushirildi.

### Verification

- API startup — passed; NestJS 3011 portda va frontend CORS 3010 bilan ishga tushdi.
- `GET /api/agent/me/companies` curl orqali authenticated pending company response qaytardi.
- Web lint/build avvalgi approval integratsiyasidan keyin passed.

### Known gaps

- Persistent browser automation sessiyasi qayta login paytida socket chekloviga uchradi; final browser click-through hali qayta tasdiqlanmagan.

### Next

- Browser sessiyasini toza context’da qayta ochib agent login → approval list → approve/reject oqimini yakuniy tekshirish.

## 2026-09-10 — Approval assignment diagnostic correction

### Changed

- Agent login bilan `GET /api/agent/me/companies` endpointi raw response darajasida tekshirildi.
- `C0000002` pending kompaniyasi `A0000001` agentiga assignment qilingan va response’da `PENDING_APPROVAL` statusi qaytmoqda.

### Verification

- Local API login (`agent@jobmatch.com`) — passed.
- Authenticated `GET /api/agent/me/companies` — passed; 1 ta pending company qaytdi.

### Known gaps

- Browser persistent sessiyasida approval UI hali `審査待ち (0)` ko‘rsatmoqda; bu stale frontend/API session yoki dev-server environment cache bo‘lishi mumkin.

### Next

- Web dev serverni `NEXT_PUBLIC_API_URL=http://localhost:3011/api` bilan fresh restart qilib, persistent browser cookie’larini yangilash va UI’da `C0000002`ni tasdiqlash.

## 2026-09-10 — Agent approval E2E fixture

### Changed

- `prisma/seed.ts` ga `pending@jobmatch.com` demo kompaniyasi qo‘shildi (`PENDING_APPROVAL`, `Pending@123456`).
- Fixture demo agentga `AgentCompany` assignment orqali bog‘landi va seed idempotent upsert qilinadi.

### Verification

- `npm run db:seed` — passed elevated verification; pending fixture yaratildi va mavjud demo yozuvlar saqlandi.
- Browser’da agent login bilan `/agent/approvals` ochildi; sahifa API’dan ma’lumot olib, empty/loading contractlari xatosiz render bo‘ldi.
- Web lint/build va `git diff --check` — passed.

### Known gaps

- Browser sessiyasidagi agent/API database projection pending fixture’ni ro‘yxatda ko‘rsatmadi (`審査待ち (0)`); backend response va assignmentni alohida diagnostika qilish kerak.

### Next

- `GET /agent/me/companies` response’ini API log/test bilan tekshirish, pending status projectionini tuzatish va approve/reject browser E2E’ni yakunlash.

## 2026-09-10 — Agent approval list API integration

### Changed

- Agent approval list `GET /api/agent/me/companies` endpointiga ulandi.
- Backend company modeli approval UI `PendingCompany` contractiga adapter orqali map qilindi.
- Ro‘yxat uchun loading, API error va empty state qo‘shildi.
- List sahifasidagi approve/reject amallari ham `reviewCompany()` orqali backendga yuboriladigan bo‘ldi.

### Decisions

- Agent faqat o‘ziga biriktirilgan kompaniyalarni ko‘radi; bu backend ownership/assignment chegarasini saqlaydi.
- Backend hozircha kompaniya emailini relation projection’ida bermagani uchun UI’da email maydoni `—` fallback bilan ko‘rsatiladi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `npm -w apps/web run build` — passed elevated verification: TypeScript va 29 route generation muvaffaqiyatli.
- `git diff --check` — passed.

### Known gaps

- Local seed’da agentga biriktirilgan `PENDING_APPROVAL` kompaniya fixture’i yo‘q; browser approval E2E hali bajarilmadi.

### Next

- Agent approval uchun deterministic pending-company seed fixture va browser E2E test qo‘shish.

## 2026-09-10 — Agent company approval API integration

### Changed

- Agent approval detail sahifasidagi approve/reject mock `setTimeout` oqimi olib tashlanib, `PATCH /api/company/:code/review` endpointiga ulandi.
- Frontend API client’ga `reviewCompany(code, action, reason?)` typed metodi qo‘shildi; reject uchun sabab yuboriladi.
- API xatosi foydalanuvchiga ko‘rsatiladi, processing holati esa `finally` orqali ishonchli tozalanadi.

### Decisions

- Backenddagi mavjud company review contracti (`approve`/`reject`) saqlandi; frontend yangi parallel endpoint yaratmaydi.
- UI’dagi mock approval ro‘yxati hozircha saqlanadi, chunki agent uchun pending-company list endpointi alohida keyingi ish sifatida ajratilgan.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `npm -w apps/web run build` — passed elevated verification: TypeScript va 29 route generation muvaffaqiyatli.
- `git diff --check` — passed.

### Known gaps

- Approval detail sahifasi pending company’larni hali mock ro‘yxatdan oladi; real list/detail API va agent assignment bilan E2E hali bajarilmadi.

### Next

- Agent approval list/detail uchun real `GET` endpointlar va pending-company seed fixture qo‘shish, so‘ng valid agent JWT bilan browser E2E bajarish.

## 2026-09-10 — Frontend authentication API integration

### Changed

- `apps/web/lib/api/client.ts` qo‘shildi: API response/error parsing, `credentials: include` va auth/job/application contractlari typed qilindi.
- Demo account login olib tashlandi; login, logout va session restore backend `/auth/login`, `/auth/logout`, `/auth/me` endpointlariga ulandi.
- Backend `CANDIDATE` roli frontend route contractidagi `USER` roliga markaziy mapping qilindi.
- Middleware uchun URL-encoded, SameSite role hint cookie yozish/tozalash qo‘shildi. Bu cookie faqat navigatsion UX gate; resource authorization backend JWT guardlarda qoladi.

### Verification

- `npm -w apps/web run lint` — passed: 0 errors, 13 existing warnings.
- O‘zgartirilgan auth/API fayllari Prettier orqali formatlandi.
- `npm -w apps/web run build` — passed elevated verification: TypeScript va 29 route generation muvaffaqiyatli yakunlandi; Next middleware convention deprecation warning mavjud.

## 2026-09-10 — Public jobs API integration

### Changed

- Public job list `/jobs` typed API client orqali `GET /job` endpointidan ma’lumot oladi.
- Search natijalari uchun loading, empty va API error holatlari qo‘shildi.
- Backend job modeli UI mock modelidan ajratilgan `toMockJob` adapter orqali render contractiga moslashtirildi.
- Job detail `/jobs/[id]` endi `GET /job/:code` endpointidan olinadi va dynamic route sifatida belgilandi.

### Verification

- `npm -w apps/web run lint` — passed: 0 errors, 13 existing warnings.
- `npm -w apps/web run build` — passed elevated verification: TypeScript va route generation muvaffaqiyatli.
- `git diff --check` — passed.

### Known gaps

- Candidate apply tugmasi hali registration redirect/mock oqimida; keyingi qadam authenticated application form va `POST /application/job/:code/apply`.
- Backend search response’ida company industry/logo va job description list projection’i cheklangan; adapter vaqtinchalik fallback qiymatlar beradi.
- `NEXT_PUBLIC_API_URL` production environment’da aniq berilishi kerak; default faqat local development uchun.

### Next

- Authenticated candidate application form va application history oqimini real endpointlarga ulash.

## 2026-09-10 — Candidate application API integration

### Changed

- Job detail sahifasidagi apply tugmasi authenticated candidate uchun cover letter form va `POST /application/job/:code/apply` endpointiga ulandi.
- Login qilinmagan foydalanuvchi job code saqlangan holda login sahifasiga yo‘naltiriladi.
- Candidate applications sahifasi `GET /application/me` orqali real status va job ma’lumotlarini ko‘rsatadi; loading/error/empty holatlari qo‘shildi.

### Verification

- `npm -w apps/web run lint` — passed: 0 errors, 13 existing warnings.
- `npm -w apps/web run build` — passed elevated verification: TypeScript va route generation muvaffaqiyatli.
- `git diff --check` — passed.

### Known gaps

- Application withdraw va agent status transition UI hali real endpointlarga ulanmagan.
- E2E test uchun seed account va browser test harness hali tayyor emas.

## 2026-09-10 — Local browser smoke test

### Changed

- Local test environment ishga tushirildi: API `3011`, web `3010`; MySQL `3306` portda ko‘tarildi. `3307` boshqa lokal loyiha tomonidan band bo‘lgani uchun browser session alohida portlar bilan ishga tushirildi.

### Verification

- `GET http://localhost:3010/jobs` — passed: sahifa browserda ochildi, API’dan 0 ta active job qaytdi va empty state ko‘rindi.
- Invalid login smoke test — passed: backend `401` response frontendda “メールアドレスまたはパスワードが正しくありません。” xatosi sifatida ko‘rindi.
- API dev server — passed: Prisma database connected, Nest routes mapped.

### Known gaps

- Database’da active job va test candidate account mavjud emas; shu sababli job detail/apply oqimini browserda muvaffaqiyatli submit qilish uchun seed data kerak.

## 2026-09-10 — Browser test seed va end-to-end apply

### Changed

- `prisma/seed.ts` idempotent demo active job (`J0000001`) bilan kengaytirildi.
- Seed job response’dagi `jobCode` va JSON `skills` formatlarini frontend adapterida normalize qilish qo‘shildi.
- Application history’da backend `appliedAt` maydoni frontend `createdAt` sifatida normalize qilindi.

### Verification

- `npm run db:seed` — passed: existing demo accounts saqlandi, `J0000001` active job tayyorlandi.
- Browser `/jobs` — passed: 1 ta active job ko‘rindi.
- Browser `/jobs/J0000001` — passed: detail sahifasi ochildi.
- Anonymous apply — passed: `/login?redirect=/jobs/J0000001&apply=1` ga yo‘naltirildi.
- Seed candidate login (`user@jobmatch.com`) — passed: job detail’da authenticated UI ko‘rindi.
- Apply form submit — passed: “応募が完了しました” xabari ko‘rindi.
- `/applications` — passed: 1 ta `PENDING` application va to‘g‘ri sana ko‘rindi.
- `npm -w apps/web run lint -- --quiet` — passed.

### Known gaps

- Seed credentials faqat local development uchun; production yoki shared environment’ga ko‘chirilmasligi kerak.
- Application withdraw va agent review transition browser testlari hali bajarilmagan.

## 2026-09-10 — Japan–Uzbekistan corporate visual direction

### Changed

- Global color tokens yangilandi: corporate navy, Japan red, Uzbekistan-inspired ultramarine va saffron accentlar.
- Public header qayta ishlanib, yengil translucent surface, compact navigation va brand mark kiritildi.
- Homepage hero full-bleed editorial photography, bilingual cross-border positioning va aniq search CTA bilan qayta kompozitsiya qilindi.
- Hero’da typography hierarchy, gradient contrast overlay va responsive viewport composition qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.
- Browser screenshot `/` — passed: hero, header, auth state va search CTA visually tekshirildi.

### Known gaps

- Corporate visual system hozircha public header/homepage’da birinchi pass sifatida qo‘llandi; candidate, company, agent va admin workspace’lar keyingi design batches’da migratsiya qilinadi.
- Hero external Unsplash image’ga tayanadi; production uchun licensed/local asset bilan almashtirish kerak.

## 2026-09-10 — Candidate workspace corporate redesign

### Changed

- Candidate sidebar public brand tokenlariga moslashtirildi: navy workspace surface, saffron progress/action accent va ultramarine active state.
- Candidate dashboard spacing va heading hierarchy operational workspace formatiga o‘tkazildi.
- Sidebar profile, navigation va logout elementlari low-chrome corporate layout sifatida qayta styled qilindi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- Browser `/dashboard` — passed: candidate workspace screenshot orqali visual tekshirildi.
- `git diff --check` — passed.

### Known gaps

- Dashboard data hali mock source’dan keladi; visual migration API integration’dan alohida davom ettiriladi.
- Mobil candidate navigation uchun drawer/bottom navigation keyingi batch’da qo‘shiladi.

## 2026-09-10 — Company workspace corporate redesign

### Changed

- Company sidebar candidate shell bilan bir xil corporate navy surface’ga o‘tkazildi.
- Company badge, verification state, active navigation va notification badge yangi ultramarine/saffron hierarchy bilan qayta styled qilindi.
- Company dashboard spacing va “Company workspace” orientation label bilan operational layout’ga moslashtirildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- Browser company login (`company@jobmatch.com`) — passed.
- Browser `/company/dashboard` — passed: seeded company workspace screenshot orqali visual tekshirildi.
- `git diff --check` — passed.

### Known gaps

- Company dashboard data hali mock source’dan keladi; real company/jobs/application API integration keyingi batch’da.

## 2026-09-10 — Agent workspace corporate redesign

### Changed

- Agent sidebar company/candidate shell bilan yagona navy corporate surface’ga o‘tkazildi.
- Agent metrics uchun saffron priority accent, ultramarine workflow action va review badge hierarchy qo‘llandi.
- Agent dashboard “Agent workspace” orientation label va compact create-job CTA bilan qayta styled qilindi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- Browser agent login (`agent@jobmatch.com`) — passed.
- Browser `/agent/dashboard` — passed: redesigned agent workspace screenshot orqali visual tekshirildi.
- `git diff --check` — passed.

### Known gaps

- Agent dashboard data hali mock source’dan keladi; approval/review workflow real API bilan keyingi batch’da ulanadi.

## 2026-09-10 — Admin governance workspace corporate redesign

### Changed

- Admin sidebar eski neutral gray’dan corporate navy governance shell’ga o‘tkazildi.
- Admin badge va critical state uchun Japan red, metric/action hierarchy uchun saffron va ultramarine tokenlar qo‘llandi.
- Admin dashboard “Governance workspace” orientation label va kengroq operational spacing bilan yangilandi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- Browser `/admin/dashboard` — passed: UI-only local role hint bilan governance workspace screenshot orqali visual tekshirildi.
- `git diff --check` — passed.

### Known gaps

- Admin dashboard ma’lumotlari hali mock source’dan keladi; real admin stats/users/companies API integration keyingi batch’da.
- Admin login seed account mavjud bo‘lsa-da, mavjud local database’dagi credential legacy bo‘lishi mumkin; production authentication bypass qilinmagan.

## 2026-09-10 — Admin stats API integration

### Changed

- Typed `AdminStats` contract va `api.adminStats()` client method qo‘shildi.
- Admin dashboard asosiy user/company/job/application metriclarini `GET /api/admin/stats` orqali oladi.
- API loading fallback (`—`) va error banner qo‘shildi; qolgan governance detail bloklari hozircha mock read model sifatida saqlandi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.
- API source contract: `/api/admin/stats` route mavjud va global response wrapper bilan qaytadi.

### Known gaps

- Admin browser session’da valid admin JWT bo‘lmasa endpoint 401 qaytaradi; UI-only role hint backend authorization o‘rnini bosmaydi.
- Seed admin mavjud local credential legacy bo‘lishi mumkin; admin E2E uchun credential reset/fixture workflow kerak.

## 2026-09-10 — Admin users API integration

### Changed

- Typed `AdminUserRecord` contract va `api.adminUsers()` method qo‘shildi.
- Admin users sahifasi endi `GET /api/admin/users` dan real records oladi.
- Backend user profile maydonlari UI jadvaliga adapter orqali moslashtirildi; loading va error holatlari qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Status toggle hali local optimistic mock update; `PATCH /api/admin/users/:code/status` ga keyingi bosqichda ulanadi.
- Admin users sahifasi valid admin JWT talab qiladi.

## 2026-09-10 — Admin companies API integration

### Changed

- Typed `AdminCompanyRecord` contract va `api.adminCompanies()` method qo‘shildi.
- Admin companies sahifasi `GET /api/admin/companies` orqali real company records oladi.
- Company status, agent assignment, location va registration date UI modeliga adapter qilindi.
- Loading va API error holatlari qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Company approve/reject tugmalari hali local optimistic state; `PATCH /api/company/:code/review` ga agent workflow orqali ulanadi.
- Active job/application aggregate’lari backend list response’da yo‘q; jadvalda vaqtinchalik `0` fallback ishlatiladi.

## 2026-09-10 — Admin agents API integration

### Changed

- Typed `AdminAgentRecord` contract va `api.adminAgents()` method qo‘shildi.
- Admin agents sahifasi `GET /api/admin/agents` response’ini table/modal modeliga adapter qiladi.
- Agent assignment count, status, contact va registration date real backend record’dan olinadi.
- Loading va API error holatlari qo‘shildi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Agent create/edit hali local modal state’da; `POST /api/admin/agents` mutation keyingi bosqichda.
- Agent performance aggregates backend list response’da yo‘q, shu sababli ayrim statistikalar `0` fallback bilan ko‘rsatiladi.

## 2026-09-10 — Admin user status mutation

### Changed

- `api.updateAdminUserStatus()` typed mutation qo‘shildi.
- Admin users sahifasidagi `停止 / 有効化` tugmalari `PATCH /api/admin/users/:code/status` endpointiga ulandi.
- Mutation vaqtida button disabled/loading holatiga o‘tadi; API xatosida local state o‘zgarmaydi va error banner ko‘rsatiladi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Mutation browserda valid admin JWT bilan yakuniy tekshirilmagan; mavjud local admin credential legacy bo‘lishi mumkin.

## 2026-09-10 — Admin agent create mutation

### Changed

- `api.createAdminAgent()` typed mutation qo‘shildi.
- Agent create modal’iga strong-password boshlang‘ich credential maydoni qo‘shildi.
- Create muvaffaqiyatli tugagach agent list backend’dan qayta yuklanadi; API xatosida modal ochiq qoladi.

### Verification

- `npm -w apps/web run lint -- --quiet` — passed.
- `git diff --check` — passed.

### Known gaps

- Admin agent edit hali local state’da; backend update endpoint mavjud emas.
- Create mutation browserda valid admin JWT bilan hali bajarilmagan.

## 2026-09-10 — Admin mutation quality gate

### Changed

- Admin user API adapter’iga `lastLoginAt` fallback qo‘shildi; real response va UI model to‘liq type-check qilindi.

### Verification

- `npm -w apps/web run build` — passed elevated verification: TypeScript, page data collection va 29 route generation muvaffaqiyatli.
- Next middleware convention deprecation warning saqlanmoqda, lekin build blocking emas.

## Entry template

```markdown
## YYYY-MM-DD — Qisqa sarlavha

### Changed

- ...

### Decisions

- ...

### Verification

- `command` — passed/failed/not run/blocked: natija.

### Known gaps

- ...

### Next

- ...
```

---

## 2026-09-10 — Backend lint va quality gates

### Changed

- API source uchun Prettier format normalizatsiya qilindi.
- Exception filter, response interceptor va bootstrap konfiguratsiyasidagi lint/type muammolari tuzatildi.
- Web ChatLayout’dagi React purity va set-state-in-effect blocking xatolari tuzatildi.

### Verification

- `npm -w apps/api test -- --runInBand --no-watchman` — passed: 18 suites, 80 tests.
- `npm -w apps/api run build` — passed.
- API ESLint (`src`, `apps`, `libs`, `test`) — passed: 0 errors.
- Web ESLint — passed: 0 errors, 14 warnings.
- `npm -w apps/web run build` — passed sandbox tashqarisida.
- `npm audit --offline --json` — passed with cached report: 0 vulnerabilities; online audit DNS sabab authoritative status emas.

### Known gaps

- Web lint warninglari: 14 unused imports/variables.
- `npm ci` outputida 29 vulnerability ko‘ringan, lekin online registry bilan qayta tasdiqlash tarmoq DNS sabab bajarilmadi.
- Email verification va candidate pre-verification authorization hali security work sifatida ochiq.

### Next

- Web lint warninglarini mock-to-API migration davomida tozalash.
- Network mavjud bo‘lganda online `npm audit` bilan vulnerability triage.
- Real frontend API vertical slice’ini boshlash.

---

## 2026-09-10 — Phase 1 quality checks

### Changed

- `npm ci` bilan dataless/corrupt dependency tree qayta o‘rnatildi.
- AI execution status transition fix va ChatLayout lint fix kiritildi.
- Local MySQL porti `.env`da `3306`ga moslashtirildi.

### Decisions

- Full backend lint cleanup alohida batch sifatida bajariladi; legacy format va yangi o‘zgarishlar bitta katta rewrite qilinmaydi.

### Verification

- `npm -w apps/api test -- --runInBand --no-watchman` — passed: 18 suites, 80 tests.
- `npm -w apps/api run build` — passed.
- `npm -w apps/web run build` — passed sandbox tashqarisida.
- `npm run lint` (`apps/web`) — passed with 14 warnings, 0 errors.
- Affected AI files ESLint — passed.
- `npm audit` — 29 vulnerabilities: 3 low, 9 moderate, 16 high, 1 critical.

### Known gaps

- Full backend lint — failed: 58 errors (legacy formatting/type rules).
- `middleware` filename deprecation warning Next.js buildda qayd etildi.
- Email verification va candidate pre-verification authorization hali tuzatilmagan.

### Next

- Backend lintni format, unsafe type va `main.ts` configuration guruhlariga ajratib tozalash.
- `npm audit` vulnerability’larini dependency tree va runtime ta’siri bo‘yicha triage qilish.

---

## 2026-09-10 — Phase 1 stabilization

### Changed

- AI execution lifecycle transition database update’iga target `status` yozilishi qo‘shildi.
- Target status persistence’ini tekshiruvchi regression unit test qo‘shildi.
- README va README.ja’dagi MySQL development porti Compose hamda `.env.example` bilan mos ravishda `3306`ga keltirildi.
- Oldingi build urinishidan qolgan orphan Turbo/Next/Nest processlari tozalandi.

### Decisions

- Local development uchun canonical MySQL host port `3306` deb belgilandi; `.env`, Compose, `.env.example` va README shu contractga moslashtirildi.
- Email verification’dagi har qanday olti xonali kodni qabul qilish holati security finding sifatida qayd qilindi; token lifecycle va limited pre-verification session birga dizayn qilinmasdan yuzaki patch qilinmaydi.

### Verification

- `prisma validate --schema=./prisma/schema.prisma` — passed.
- Docker Compose service status — passed: MySQL, Redis va MinIO healthy.
- `prisma migrate status --schema=./prisma/schema.prisma` — passed sandbox tashqarisida: 2 ta migration topildi, database schema up to date.
- `prisma migrate deploy --schema=./prisma/schema.prisma` — passed local Docker MySQL’da: pending migration yo‘q.
- AI service va regression spec TypeScript `transpileModule` — passed.
- Affected AI files Prettier check — passed.
- Targeted Jest regression test — blocked: test runner testni bajarmasdan process holatida qoladi; `--runInBand`, `--no-cache`, `--no-watchman` va `--forceExit` holatni o‘zgartirmadi.
- API TypeScript full check — blocked: compiler yakuniy output bermadi va qo‘lda to‘xtatildi.

### Known gaps

- `verifyEmail` faqat olti xonali formatni tekshiradi; code/token persisted verification bilan solishtirilmaydi.
- Candidate `PENDING_VERIFICATION` holatida login qilib umumiy candidate JWT olishi mumkin; protected capability restriction mavjud emas.
- Jest/TypeScript hang’ining yakuniy root sababi aniqlanmagan.

### Next

- Jest/TypeScript process hang’ini minimal reproduction bilan ajratish.
- Email verification uchun token lifecycle va pre-verification authorization contractini loyihalash.

---

## 2026-09-10 — Documentation baseline (initial entry)

### Changed

- Markaziy `docs/README.md` hujjatlar xaritasi yaratildi.
- Repository daliliga asoslangan `docs/PROJECT_STATUS.md` yaratildi.
- Bosqichlar va aniq Done mezonlari bilan `docs/ROADMAP.md` yaratildi.
- DDD bounded context va data ownership modeli hujjatlashtirildi.
- Clean Architecture dependency va migration qoidalari hujjatlashtirildi.
- Security va AI engineering roadmap’lari alohida hujjatlarga ajratildi.
- Root `README.md` va `ARCHITECTURE.md`ga yangi hujjatlar navigatsiyasi qo‘shildi.
- Ushbu append-only development log joriy qilindi.

### Decisions

- Hozirgi arxitektura modular monolith sifatida saqlanadi; microservice faqat o‘lchanadigan operational ehtiyoj bilan ko‘rib chiqiladi.
- Birinchi delivery maqsadi Company → Job → Application vertikal oqimini real API bilan end-to-end yakunlash.
- Current state, roadmap va arxitektura da’volari alohida hujjatlarda yuritiladi.

### Verification

- `git diff --check` — passed: whitespace xatolari topilmadi.
- Yangi hujjatlar uchun `prettier --write` — passed.
- Hujjat indexlarida ko‘rsatilgan local file path’lar — passed: barcha target fayllar mavjud.
- To‘liq Markdown `prettier --check` — failed: oldindan mavjud `README.md`, `ARCHITECTURE.md` va `docs/architecture/ai-resume-processing.md` hamda uchta yangi faylda format farqlari topildi; yangi fayllar formatlandi, mavjud katta hujjatlar foydalanuvchi diffini kengaytirmaslik uchun avtomatik qayta yozilmadi.
- API test/build va web build — `blocked`: oldingi tekshiruvda jarayonlar ikki daqiqadan ortiq yakuniy output bermadi va qo‘lda to‘xtatildi.

### Known gaps

- Joriy 38 ta modified/untracked path hali stabilization va review talab qiladi.
- Queue, storage, AI provider va production operations bo‘yicha qarorlar ochiq.
- Security control’larning ko‘pi integration/E2E daliliga ega emas.

### Next

- Phase 1: branch stabilization, build/test hang diagnostikasi va migration validation.
