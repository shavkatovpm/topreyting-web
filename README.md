# Top Reyting (topreyting.uz)

O'zbekistondagi eng katta mustaqil reyting platformasi MVP — content-first SEO/AEO strategiyasi bilan qurilgan.

## Nima qilingan

**MVP fokus:** kontent + SEO/AEO infrastruktura. Backend yo'q. Listing'lar mock data'dan, maqolalar MDX'dan o'qiladi. Build vaqtida 153 ta statik sahifa generated bo'ladi.

### Sahifalar

- `/` — Bosh sahifa: hero, mashhur kategoriyalar, top listing'lar, maqolalar
- `/[kategoriya]` — Kategoriya sahifasi (10 ta kategoriya)
- `/[kategoriya]/[shahar]` — Kategoriya + shahar (12 ta shahar × 10 = 120 sahifa)
- `/[kategoriya]/[shahar]/[slug]` — Listing detail (rich data, FAQ, reviews placeholder)
- `/maqolalar` — Maqolalar ro'yxati
- `/maqolalar/[slug]` — MDX maqola + FAQ schema
- `/qidiruv` — Qidiruv (mock data ustida)
- `/qoshish` — E'lon qo'shish formasi (UI tayyor, backend yo'q)
- `/biz-haqimizda`, `/aloqa`, `/reklama`, `/maxfiylik`, `/shartlar`

### SEO/AEO infrastruktura

- `sitemap.xml` (153 URL) — `/src/app/sitemap.ts`
- `robots.txt` — AI crawlerlar (GPTBot, ClaudeBot, PerplexityBot va h.k.) uchun explicit allow
- `llms.txt` — `/public/llms.txt` (AI'lar uchun strukturalashgan ma'lumot)
- **JSON-LD schemalari:** Organization, WebSite, BreadcrumbList, LocalBusiness, AggregateRating, Review, FAQPage, Article, ItemList
- OpenGraph + Twitter cards har sahifada
- Semantik HTML (article, nav, h1/h2, microdata atributlari)
- Static rendering (ISR keyinroq qo'shiladi)
- Multi-language ready (hozircha o'zbek lotin)

### Kontent strategiyasi

`/content/articles/*.mdx` papkasida pillar maqolalar:

1. **Toshkentdagi eng yaxshi 10 ta klinika 2026** — yuqori frequencyli "top X" tipidagi reyting maqola
2. **Marketing agentligini qanday tanlash** — qo'llanma + comparison
3. **O'zbekistonda IT kompaniya tanlash** — qo'llanma + narxlar jadvali

Har bir maqolada:
- FAQ bo'limi (FAQPage schema → AEO direct hit)
- Author/Expert info (E-E-A-T)
- Listing'larga ichki linklar (link juice)
- Tags, reading time, published/updated dates

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (`globals.css`'da OKLCH ranglar)
- **shadcn-style** komponentlar (button, card, badge, star-rating)
- **MDX** — `next-mdx-remote/rsc` orqali
- **lucide-react** — ikonkalar
- **gray-matter + reading-time** — frontmatter va o'qish vaqti

Backend yo'q. Prisma/NextAuth/Database — keyinchalik trafik kelganda qo'shiladi.

## Folder struktura

```
src/
  app/
    [category]/
      page.tsx                    # /klinikalar
      [city]/
        page.tsx                  # /klinikalar/toshkent
        [slug]/page.tsx           # /klinikalar/toshkent/medion-clinic
    maqolalar/
      page.tsx
      [slug]/page.tsx
    qoshish/, qidiruv/, aloqa/, biz-haqimizda/, reklama/
    maxfiylik/, shartlar/
    layout.tsx, page.tsx, not-found.tsx
    sitemap.ts, robots.ts
  components/
    layout/    # header, footer, logo
    cards/     # listing-card, category-card, article-card
    ui/        # button, card, badge, star-rating
    json-ld.tsx
  data/
    categories.ts                 # 10 ta kategoriya
    cities.ts                     # 12 ta shahar
    listings.ts                   # mock listing'lar
  lib/
    site.ts                       # site config (name, url, social, keywords)
    utils.ts                      # cn(), formatNumber()
    articles.ts                   # MDX o'qish va parsing
    jsonld.ts                     # barcha schema generatorlari
content/
  articles/
    *.mdx                         # pillar maqolalar
public/
  llms.txt                        # AI crawlerlar uchun
```

## Komandalarni ishga tushirish

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build (153 statik sahifa)
npm start        # production server
```

## Keyingi qadamlar (roadmap)

**Faza 2 — kontent kengaytirish (1-2 oy):**

- Har bir kategoriyada 10-20 ta pillar maqola
- Har bir kategoriya × shahar uchun "city landing" maqolalari
- FAQ databaseni kengaytirish (har bir maqolada 5-10 ta savol)
- Internal linking strategiyasi (har maqola 3-5 ta listing'ga link)
- Maqola comparison jadvallari, narx kalkulyatorlari

**Faza 3 — backend (trafik kelgandan keyin):**

- Prisma + PostgreSQL
- NextAuth v5 (telefon OTP — Eskiz.uz)
- Admin panel (listing CRUD, sharhlarni moderatsiya)
- User-generated reviews
- Search backend (Postgres trigram yoki Meilisearch)

**Faza 4 — monetizatsiya:**

- Click/Payme integratsiyasi
- Pro/TOP tariflar
- Featured listing rotation
- Sponsorlik joylashuvlari

## Brand

**Ranglar:** primary `oklch(0.55 0.22 35)` (warm orange) + gold accent `oklch(0.78 0.16 85)` — "trophy/top" feel.

**Logo:** "TR" gradient — warm orange → gold. "Top**Reyting**" wordmark.

**Domen:** topreyting.uz

## Eslatma

Ushbu MVP **fizik backend yo'q** — barcha ma'lumot mock. Listing qo'shish formasi UI ko'rinishida, `disabled` holatida. Telegram (`@topreyting`) va email orqali qo'lda qabul qilinadi va admin tomonidan `src/data/listings.ts`'ga qo'shiladi (rebuild kerak — vaqtinchalik yondashuv).

Bu strategik tanlov: avval kontent va SEO bilan auditoriya yig'ish, keyin auditoriya kelganda backend qurish.
