# JobMatch Platform hujjatlari

Bu katalog loyiha bo‘yicha texnik qarorlar, joriy holat va keyingi ishlarning yagona kirish nuqtasidir.

## Qayerdan boshlash kerak?

| Savol                                   | Hujjat                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------ |
| Loyiha hozir qayerda?                   | [PROJECT_STATUS.md](./PROJECT_STATUS.md)                                       |
| Keyingi ish nima?                       | [ROADMAP.md](./ROADMAP.md)                                                     |
| Umumiy arxitektura qoidalari qanday?    | [../ARCHITECTURE.md](../ARCHITECTURE.md)                                       |
| Domenlar va ularning egaligi qanday?    | [architecture/domain-model.md](./architecture/domain-model.md)                 |
| Clean Architecture qanday qo‘llanadi?   | [architecture/clean-architecture.md](./architecture/clean-architecture.md)     |
| AI resume oqimi qanday ishlaydi?        | [architecture/ai-resume-processing.md](./architecture/ai-resume-processing.md) |
| Security bo‘yicha nimalar qilish kerak? | [security/README.md](./security/README.md)                                     |
| AI qanday xavfsiz joriy qilinadi?       | [ai/README.md](./ai/README.md)                                                 |
| Observability qanday boshqariladi?      | [observability/README.md](./observability/README.md)                           |
| Production deploy qanday tekshiriladi? | [operations/deployment-checklist.md](./operations/deployment-checklist.md)     |
| Multer security remediation qanday?     | [security/multer-remediation.md](./security/multer-remediation.md)             |
| Security vulnerability qanday xabar qilinadi? | [../SECURITY.md](../SECURITY.md)                                      |
| Oxirgi bajarilgan ishlar qaysilar?      | [../DEVLOG.md](../DEVLOG.md)                                                   |

## Hujjat turlari va ularning vazifasi

- `README.md` — mahsulot va repository bilan birinchi tanishuv.
- `PROJECT_STATUS.md` — faqat repository dalili bilan tasdiqlangan joriy holat.
- `ROADMAP.md` — rejalashtirilgan ishlar, tartib va yakunlash mezonlari.
- `ARCHITECTURE.md` — amaldagi umumiy qoidalar va cheklovlar.
- `docs/architecture/*` — muayyan arxitektura mavzusining batafsil dizayni.
- `docs/security/*` va `docs/ai/*` — maxsus sifat va xavfsizlik rejalari.
- `DEVLOG.md` — bajarilgan ishlar va tekshiruvlarning xronologik jurnali.

## Holat belgilari

Hujjatlarda quyidagi belgilardan foydalaniladi:

- `VERIFIED` — repository, test yoki bajarilgan buyruq bilan tasdiqlangan.
- `IN PROGRESS` — kodi mavjud, lekin integratsiya yoki tekshiruv tugallanmagan.
- `PROPOSED` — tasdiqlangan yo‘nalish, ammo hali amalga oshirilmagan.
- `UNKNOWN` — to‘g‘ri qaror uchun dalil yetarli emas.
- `BLOCKER` — aniq qaror yoki tashqi ma’lumot bo‘lmasa ishni xavfsiz davom ettirib bo‘lmaydi.

## Yangilash qoidasi

Kod o‘zgarishi loyiha holati, API contract, arxitektura, security yoki AI oqimiga ta’sir qilsa, tegishli hujjat va `DEVLOG.md` o‘sha o‘zgarish bilan birga yangilanadi. Reja bajarilganda element o‘chirib yuborilmaydi: holati va dalili yangilanadi.
