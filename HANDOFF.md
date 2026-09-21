# Topreyting.uz — davom ettirish uchun qisqa yo'riqnoma

## Loyiha nima
O'zbekiston brendlarining **pullik yig'iluvchi reytingi**: o'rin = brendning shu kategoriyaga kiritgan tasdiqlangan to'lovlari yig'indisi (sifat bahosi emas, sayt buni ochiq aytadi). Maqolalar (MDX, UZ+RU) reytingdan alohida.

Biznes qoidalari:
- Har to'lov brendni **3 oyga** faol qiladi (sanadan boshlab, yig'ilmaydi). To'lanmasa brend saytdan yo'qoladi, summa saqlanadi, qayta to'lasa qaytadi.
- Minimal to'lov admin sozlaydi (default **50 000 so'm**), har bir to'lovga qo'llanadi.
- Bosh sahifada hamma brend: 1–3 **premium**, oxirgi 3 **qizil zona** (kamida 7 brend bo'lsa), qolgani standart.
- Saytdan ariza: modal (4 bosqich, oxirida to'lov cheki) -> Telegram guruhi -> admin «Tasdiqlash» -> to'lov yoziladi va brend avtomatik joylanadi. Rad etish faqat admin panelda.
- Rollar: `SUPER_ADMIN`, `ADMIN` (backend'da tekshiriladi).

## MacBook'da ishga tushirish
Kerak: Node 24 (yoki >= 22.18), npm.

```bash
git pull
npm install
cp .env.example .env            # so'ng SESSION_SECRET (openssl rand -hex 32) va SEED_ADMIN_PASSWORD ni to'ldiring
npx prisma migrate deploy       # bazani yaratadi (prisma/dev.db)
npx prisma generate             # Prisma client (src/generated/prisma, git'da yo'q)
npm run db:seed                 # kategoriyalar, 001 Barbershop, sozlamalar, Super Admin
npm run dev                     # http://localhost:3000   admin: /admin
```

Yordamchi buyruqlar: `npm test` (birlik testlari), `npm run admin:create -- <email> <ism> <SUPER_ADMIN|ADMIN> <parol> [telegramId]`.

Eslatma: `.env`, `prisma/dev.db`, `storage/` (chek fayllari) git'ga tushmaydi. Windows'dagi lokal baza ko'chmaydi, MacBook'da seed'dan boshlanadi.

## Kod xaritasi
- `src/lib/ranking.ts` — reyting, zonalar, 3 oylik muddat, minimal summa (sof funksiyalar, testlangan). **Reyting hech qachon saqlanmaydi.**
- `src/lib/public-data.ts` — public sahifalar uchun so'rovlar; `src/lib/submissions.ts` — arizani tasdiqlash/rad etish (bitta tranzaksiya).
- `src/lib/submission-validation.ts` — ariza va chek tekshiruvi; `src/lib/telegram.ts` — guruhga xabar.
- `src/app/admin/**` — admin panel (login, brendlar, kategoriyalar, to'lovlar, arizalar, sozlamalar, jurnal); `src/app/api/submissions`, `src/app/api/telegram/webhook`.
- `src/app/[lang]/[category]/[brand]` — brend sahifasi (`/[kategoriya]/[brend]`); eski `/kategoriya/shahar/brend` yo'naltiriladi.
- `src/components/join/*` — «Reytingga qo'shilish» modali.
- `prisma/schema.prisma` — ma'lumotlar modeli; `src/proxy.ts` — til va `/admin` yo'naltirishi.

## Bosh sahifa dizayni (Navy)
- Bosh sahifa `src/app/[lang]/(home)/` da (Navy dizayn: `topreyting-ui-preview/index.html` dan). Ichki sahifalar `src/app/[lang]/(site)/` da, umumiy sayt dizaynida qoladi (route group, URL o'zgarmaydi).
- `navy.css` — dizayn CSS'ining **mexanik ko'chirmasi** (skript bilan: `.nv` scope, `--nv-*` o'zgaruvchilar, `@layer nv`). Unga qo'lda tegmang; o'zgartirishlar `navy-extra.css` da. `globals.css` boshidagi `@layer theme, base, components, nv, utilities;` tartibi muhim: shunda umumiy komponentlardagi Tailwind klasslari (ArticleCard, JoinModal) Navy qoidalarini bosib ketadi.
- Umumiy komponentlar Navy'da loyiha tokenlari (`--background`, `--primary`, ...) `navy-extra.css` da `.nv` ichida qayta yozilgani uchun mos rangga o'tadi.
- Jadval va sticky panel (kategoriya dropdown + qidiruv): `src/components/home/home-board.tsx`; ma'lumot: `getHomeBoard()` (`src/lib/public-data.ts`). «Hissa oshirish» — mavjud brendga qo'shimcha to'lov: modal 2 bosqichli rejimda ochiladi, ariza `data.kind = "boost"`, tasdiqlanganda faqat to'lov yoziladi (`approveBoost`).

## Nima qoldi
**Sizdan kutilyapti:** droplet ma'lumotlari (IP, domen DNS), Telegram bot tokeni + guruh ID + adminlarning Telegram ID'lari, to'lov rekvizitlari (admin: Sozlamalar), `shartlar` / `maxfiylik` / `reklama` sahifalarini ko'rib chiqish (hali eski "sharh" modeli haqida yozadi).

**Keyingi ishlar (tavsiya etilgan tartib):**
1. Admin boshqaruvi sahifasi (admin yaratish/bloklash, Telegram ID kiritish) — hozir faqat CLI.
2. Analytics: chiquvchi kliklar (`/out/...`), sahifa ko'rishlar, Super Admin dashboard (daromad, brend, admin ko'rsatkichlari).
3. Deploy: Postgres (`src/lib/db.ts` adapteri + `provider` almashadi), nginx (**`X-Forwarded-For` ni qayta yozsin**, aks holda rate limit aylanib o'tiladi), HTTPS, jarayon boshqaruvi, zaxira nusxa, Telegram webhook (`/api/telegram/webhook`, `secret_token` = `TELEGRAM_WEBHOOK_SECRET`).
4. Tezlik: `src/app/layout.tsx` dagi `headers()` butun saytni dinamik qiladi; til `x-locale` o'rniga boshqacha aniqlansin.
5. RU: brend/kategoriya matni bazada faqat UZ (RU sahifa UZ'ga canonical); RU maydonlari + hreflang.
6. Kichiklar: logo yuklash (moderatsiya bilan), brendni butunlay o'chirish (Super Admin), egasi uchun «yangilash» oqimi, `llms.txt`.

**Ochiq xavflar:** ariza matni moderatsiyasiz chiqadi (faqat minimal uzunlik); Telegram tugmasi ariza beruvchi ko'rsatgan summani qabul qiladi; rate limit bitta server jarayoni uchun.

## Texnik ogohlantirishlar
- Next.js 16: yozishdan oldin `node_modules/next/dist/docs/` ni o'qing (`AGENTS.md`). `middleware` -> `proxy`, `revalidateTag(tag, 'max')`.
- Prisma **7.10.0** ga qadab qo'yilgan (`latest` tegi 8.0 beta'ga ishora qiladi, o'zgartirmang).
- Claude Code sessiyasida `prisma migrate dev` / `reset` interaktiv emas va bloklangan. Yangi migratsiya: `npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` natijasini `prisma/migrations/<vaqt>_<nom>/migration.sql` ga yozing, so'ng `npx prisma migrate deploy`.
- Admin o'zgarishlari `revalidatePublic()` (`src/lib/revalidate.ts`) orqali public keshni yangilaydi; yangi mutatsiya qo'shsangiz uni chaqiring.
- Brauzer end-to-end testlari (62 tekshiruv) repoda yo'q, faqat birlik testlari (`npm test`, 17 ta).
