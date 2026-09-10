# Multer remediation decision

## Holat

Dependabot `multer` paketining `<2.3.0` versiyalarini xavfli deb belgilagan. Hozirgi dependency chain:

`@nestjs/platform-express@11.1.17 → multer@2.1.1`

Eng yangi tekshirilgan NestJS 11.2.3 ham `multer@2.2.0` talab qiladi. Loyiha hozircha file upload interceptor ishlatmaydi.

## Qaror

Hozircha ishlamaydigan `overrides` yoki lockfile’ni qo‘lda buzadigan patch qo‘llanmaydi. Bunday o‘zgarish reproducible install va CI ishonchliligini pasaytiradi.

## Variantlar

1. **Upstream NestJS patch’ini kutish (tavsiya etiladi).** NestJS patched multer range’iga o‘tgach, dependency update va Dependabot run qayta tekshiriladi.
2. **Fastify adapter’iga migratsiya.** Multer dependency’sidan qochish mumkin, lekin bootstrap, middleware, file handling va E2E testlarida breaking change bo‘ladi.
3. **Custom patched fork.** Tezroq nazorat beradi, ammo fork maintenance va security update mas’uliyati loyihaga o‘tadi.

## Vaqtinchalik mitigatsiya

- File upload endpointlari mavjud emas; yangi upload endpoint qo‘shilsa, MIME/type allowlist, size limit, random filename va malware scanning majburiy.
- CI `npm audit` hisobotini saqlaydi; Dependabot alert yopilmaguncha security debt sifatida kuzatiladi.

## Acceptance criteria

- `npm ls multer --all` faqat patched versiyani ko‘rsatadi yoki platform-express dependency’si olib tashlanadi.
- `npm ci`, API test/build va E2E testlar muvaffaqiyatli o‘tadi.
- GitHub Dependabot security update run muvaffaqiyatli yakunlanadi.
