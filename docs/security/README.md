# Security roadmap

**Status:** IN PROGRESS / unverified until tested.

Security control kodi yoki hujjati mavjudligi tizim xavfsizligini isbotlamaydi. Har bir control tegishli boundary’da test yoki runtime daliliga ega bo‘lishi kerak.

## P0 — MVP’dan oldin

| Control                        | Joriy holat                                             | Yopish dalili                                         |
| ------------------------------ | ------------------------------------------------------- | ----------------------------------------------------- |
| Authentication default-deny    | IN PROGRESS: global JWT guard mavjud                    | Public/protected controller integration tests         |
| Resource authorization         | IN PROGRESS: ayrim assignment/ownership checklar mavjud | Ikki user/company/agent identity bilan denial tests   |
| Password hashing               | IN PROGRESS: bcrypt 12-round code mavjud                | Registration test va stored hash assertion            |
| Cookie session                 | PROPOSED                                                | `httpOnly`, `Secure`, `SameSite` cookie E2E assertion |
| Refresh rotation/reuse defense | PROPOSED                                                | Old token reuse rad etiladigan integration test       |
| CSRF va CORS                   | PROPOSED                                                | Cross-origin va missing-CSRF negative tests           |
| Auth rate limit                | PROPOSED                                                | Threshold va recovery test                            |
| DTO/input validation           | IN PROGRESS                                             | Invalid/boundary payload controller tests             |
| Audit log                      | PROPOSED                                                | Admin/agent mutation audit integration test           |
| Sensitive logging redaction    | UNKNOWN                                                 | Log capture tests va review                           |

## File security

- Private bucket/object namespace.
- Upload authorization va owner-bound object key.
- File size, extension, MIME va magic-byte validation.
- Malware scan tugamaguncha quarantine.
- Short-lived presigned URL.
- Retention, deletion va orphan cleanup policy.
- Download/read/delete audit event.

## AI security

- Resume, job description, retrieved content va model output — untrusted input.
- Prompt policy, user content va tool result aniq ajratiladi.
- AI tool’lari allowlist va argument schema bilan cheklanadi.
- State-changing tool explicit user authorization talab qiladi.
- Prompt injection, data exfiltration va cross-user retrieval evaluation majburiy.
- Raw resume/prompt/model response audit logga yozilmaydi.

## CI security gates

- Dependency vulnerability scan.
- Secret scanning.
- Static analysis va lint/typecheck.
- Container image scan yaratilganda.
- Migration review.
- Security integration test suite.

## BLOCKER qarorlar

- Production domain/origin va deployment topology.
- Cookie domain va cross-site talablar.
- Storage provider, region va retention.
- Audit retention va kim audit ma’lumotini ko‘ra olishi.
- PII residency/deletion talablari.
