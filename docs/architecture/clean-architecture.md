# Clean Architecture qoidalari

**Status:** PROPOSED migration convention. Mavjud kod bosqichma-bosqich ko‘chiriladi; big-bang rewrite qilinmaydi.

## Maqsad

Business policy’larni NestJS, Prisma, queue, storage va AI provider o‘zgarishlaridan himoya qilish. Clean Architecture alohida papkalar soni emas, dependency yo‘nalishi bilan o‘lchanadi.

## Konseptual qatlamlar

```text
Composition → Adapters → Application → Domain
```

- `Domain`: entity, value object, invariant, lifecycle policy, domain event.
- `Application`: use case orchestration, authorization intent, transaction boundary va portlar.
- `Adapters`: controller/DTO, Prisma, queue, storage, email va AI provider.
- `Composition`: Nest module, configuration va dependency injection wiring.

## Modul ichidagi tavsiya etilgan ko‘rinish

```text
modules/application/
├── domain/
│   └── application-status.policy.ts
├── application/
│   └── use-cases/
├── adapters/
│   ├── http/
│   └── persistence/
└── application.module.ts
```

Bu target ko‘rinish. Har bir oddiy CRUD modulini majburan shu daraxtga ko‘chirish shart emas.

## Majburiy dependency qoidalari

- Domain NestJS, Prisma, controller, DTO, queue yoki provider SDK import qilmaydi.
- Controller business rule bajarmaydi; request’ni validate qilib use case’ga uzatadi.
- Application use case framework response/request obyektlarini qabul qilmaydi.
- Prisma transaction boundary application use case talabiga mos keladi.
- Faqat real volatile boundary uchun port yaratiladi: AI, storage, queue, email, clock kabi.
- Generic repository business intent’ni yo‘qotsa, ishlatilmaydi.
- `common` katalogi faqat haqiqiy shared kernel uchun; tasodifiy helper omboriga aylanmaydi.

## Birinchi reference vertical slice

`Company registration → approval → job publish → candidate apply → status update` oqimi reference implementation bo‘ladi. Unda:

1. Actor va authorization aniqlanadi.
2. Domain invariant va transition policy ishlatiladi.
3. Business write va outbox event bitta transactionda yoziladi.
4. HTTP va Prisma mapping adapterda qoladi.
5. Domain/application testlari infrastrukturasiz ishlaydi.
6. Database, auth va serialization real integration test bilan tekshiriladi.

## Architecture fitness checks

- Domain import boundary static check.
- Har bir lifecycle uchun positive va negative policy test.
- Retryable command uchun idempotency collision test.
- Business fact va outbox event bir transactionda yozilganini integration test.
- Ikki identity yordamida ownership/assignment denial test.
- Queue, storage va AI adapterlari uchun contract test.

## Ataylab saqlanadigan coupling

- NestJS modular monolith hozirgi composition/runtime sifatida qoladi.
- Prisma oddiy query-heavy supporting modullarda bevosita service ichida vaqtincha qolishi mumkin.
- Mustaqil operational ehtiyoj tasdiqlanmaguncha microservice yaratilmaydi.
