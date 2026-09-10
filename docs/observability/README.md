# Observability

## Runtime configuration

`.env` uchun asosiy sozlamalar:

```dotenv
LOG_LEVELS=error,warn,log
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis123
```

`GET /api/health` DB readiness probe sifatida ishlaydi va monitoring polling uchun throttling’dan chiqarilgan.

## Log contract

API access loglari JSON event sifatida yoziladi:

```json
{
  "event": "http.request",
  "requestId": "uuid-or-client-id",
  "method": "PATCH",
  "path": "/api/application/APP0000001/status",
  "statusCode": 200,
  "durationMs": 42
}
```

Unhandled exception eventlari `event=http.exception` va shu `requestId` bilan yoziladi. Password, token, query string va request body log qilinmaydi.

## Correlation workflow

1. Client response header’dan `X-Request-ID`ni oladi.
2. Error response ichidagi `error.requestId` bilan solishtiriladi.
3. Log aggregator’da `requestId` bo‘yicha eventlar qidiriladi.

## Initial alerts

| Alert | Initial threshold | Action |
|---|---:|---|
| 5xx rate | >2% for 5 min | Exception eventlarini tekshirish |
| p95 latency | >1.5s for 10 min | Sekin route va DB query’larni tekshirish |
| Login 429 spike | >20/min | Brute-force yoki abusive client tekshiruvi |
| Redis unavailable | Sustained error | Fallback va Redis recovery tekshiruvi |

Thresholds production baseline asosida sozlanadi.

## Security notes

- Client request ID faqat safe character set va 128 belgigacha qabul qilinadi.
- Production’da log sink access control va retention policy majburiy.
- PII va authentication secret’lar logga kiritilmaydi.
