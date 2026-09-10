# Production deployment checklist

## Required environment

- `NODE_ENV=production`
- `DATABASE_URL` — production MySQL connection string
- `JWT_ACCESS_SECRET` va `JWT_REFRESH_SECRET` — kamida 32 belgili secret manager qiymatlari
- `FRONTEND_URL` — aniq production origin
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `LOG_LEVELS=error,warn,log` (zarurat bo‘lsa `debug` vaqtincha yoqiladi)

## Pre-deploy gates

1. `npm ci`
2. `npx prisma generate --schema=./prisma/schema.prisma`
3. `npx prisma migrate deploy --schema=./prisma/schema.prisma`
4. `npm run lint`
5. `npm run test`
6. `npm run build`

## Post-deploy smoke

- `GET /api/health` — HTTP 200 va `data.status=ok`
- Response’da `X-Request-ID` header mavjudligi
- Invalid login request’lar 401 bilan qaytishi
- Login abuse threshold’dan keyin 429 qaytishi
- Redis throttler counter’lari Redis’da yaratilishi

## Rollback triggers

- Health check ketma-ket 3 marta failed
- 5xx rate >2% for 5 minutes
- Database migration error
- Redis unavailable va fallback alerti sustained bo‘lishi
