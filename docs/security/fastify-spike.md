# Fastify migration spike

## Scope inventory

API’da Express’ga bevosita bog‘langan joylar:

- `apps/api/src/main.ts` — `Request`, `Response`, `NextFunction` middleware’lari.
- `auth` JWT strategiyalari — cookie extractor uchun Express `Request`.
- `auth.controller.ts` — passthrough `Response` orqali cookie yozish.
- `roles.guard.ts`, `current-user.decorator.ts`, exception filter — Express request/response tiplari.
- `@nestjs/platform-express` — transitive `multer` dependency manbai.

## Baholash

Fastify migration multer alertlarini yo‘qotishi mumkin, ammo cookie, middleware, exception filter, CORS va E2E bootstrap’ini qayta moslashtirish talab qilinadi. Bu security patch emas, alohida breaking-change sprint.

## Tavsiya etilgan bosqichlar

1. `@nestjs/platform-fastify` va `fastify-cookie` compatibility spike.
2. Request ID, access log, exception filter va auth cookie adapter’larini framework-neutral port’ga ajratish.
3. Adapter swap’ni feature flag/branch’da bajarish.
4. API unit, E2E, migration va load smoke testlarini solishtirish.
5. Faqat barcha acceptance criteria bajarilgach main’ga merge qilish.

## Acceptance criteria

- `npm ls @nestjs/platform-express multer --all` dependency chain’i yo‘q.
- Cookie-based access/refresh auth ishlaydi.
- 6 ta mavjud Playwright smoke test va API testlar muvaffaqiyatli.
- p95 latency va error rate Express baseline’dan yomonlashmaydi.
