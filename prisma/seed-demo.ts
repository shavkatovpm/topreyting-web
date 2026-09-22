/**
 * Lokal UI sinovi uchun DEMO reytinglar: 15 ta brend, turli summa / muddat / kategoriya.
 *
 *   npx tsx prisma/seed-demo.ts            # yaratadi (eski demo'ni tozalab, sanalarni "hozir"dan qayta hisoblaydi)
 *   npx tsx prisma/seed-demo.ts --remove   # demo ma'lumotni o'chiradi
 *
 * Faqat lokal SQLite uchun (boshqa baza bo'lsa to'xtaydi). Demo brendlar slug'i `demo-` bilan boshlanadi.
 * Sinaladigan holatlar: premium (1–3), qizil zona (oxirgi 3), muddati tugayapti (<= 14 kun),
 * teng summa (tie-break), bir necha to'lov (yig'ilish), bir necha kategoriya, uzun nom, havolasiz brend.
 */
import "dotenv/config";
import { db } from "../src/lib/db";
import { DEFAULT_ACTIVE_MONTHS, deriveState } from "../src/lib/ranking";

if (process.env.NODE_ENV === "production" || !process.env.DATABASE_URL?.startsWith("file:")) {
  console.error("Demo ma'lumot faqat lokal SQLite uchun (DATABASE_URL=file:...). To'xtatildi.");
  process.exit(1);
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

type Entry = { category: string; payments: [amount: number, daysAgo: number][] };
type Demo = {
  slug: string;
  name: string;
  short: string;
  city: string;
  links?: { site?: boolean; telegram?: boolean; instagram?: boolean };
  entries: Entry[];
};

const DEMO: Demo[] = [
  // --- Go'zallik ---
  { slug: "demo-nur-gozallik-saloni", name: "Nur Go'zallik Saloni", city: "toshkent", short: "Soch, manikyur va yuz parvarishi — Chilonzorda qulay narxlarda.", links: { site: true, telegram: true, instagram: true }, entries: [{ category: "go-zallik", payments: [[2_000_000, 12], [1_500_000, 5]] }] },
  { slug: "demo-lola-beauty", name: "Lola Beauty Studio", city: "toshkent", short: "Makiyaj va kosmetologiya xizmatlari, oldindan yozilish orqali.", links: { site: true, instagram: true }, entries: [{ category: "go-zallik", payments: [[2_500_000, 20]] }] },
  { slug: "demo-barber-king", name: "Barber King", city: "samarqand", short: "Erkaklar sartaroshxonasi: soch, soqol va vosita bilan parvarish.", links: { instagram: true }, entries: [{ category: "go-zallik", payments: [[1_200_000, 9]] }, { category: "bizneslar", payments: [[800_000, 30]] }] },
  { slug: "demo-silk-spa", name: "Silk Spa & Wellness Center Tashkent City", city: "toshkent", short: "Spa, massaj va sog'lomlashtirish dasturlari (uzun nom sinovi).", links: { site: true }, entries: [{ category: "go-zallik", payments: [[900_000, 40]] }] },
  { slug: "demo-mirra-nails", name: "Mirra Nails", city: "namangan", short: "Manikyur va pedikyur, gel-lak va dizayn.", links: { telegram: true }, entries: [{ category: "go-zallik", payments: [[300_000, 60]] }] },
  { slug: "demo-zebo-kosmetika", name: "Zebo Kosmetika", city: "buxoro", short: "Tabiiy kosmetika va teri parvarishi vositalari (havolasiz brend).", entries: [{ category: "go-zallik", payments: [[100_000, 85]] }] },
  // --- IT kompaniyalar ---
  { slug: "demo-pixel-labs", name: "Pixel Labs", city: "toshkent", short: "Veb-sayt, mobil ilova va UI/UX dizayn — g'oyadan ishga tushirishgacha.", links: { site: true, telegram: true, instagram: true }, entries: [{ category: "it-kompaniyalar", payments: [[4_000_000, 3], [1_000_000, 25]] }] },
  { slug: "demo-novasoft", name: "NovaSoft Solutions", city: "toshkent", short: "Korxonalar uchun CRM va avtomatlashtirish tizimlari.", links: { site: true, telegram: true }, entries: [{ category: "it-kompaniyalar", payments: [[3_000_000, 10]] }, { category: "bizneslar", payments: [[500_000, 10]] }] },
  { slug: "demo-kodli-group", name: "Kodli Group", city: "andijon", short: "Telegram botlar, e-commerce va integratsiyalar.", links: { site: true }, entries: [{ category: "it-kompaniyalar", payments: [[1_800_000, 15]] }, { category: "bizneslar", payments: [[400_000, 18]] }] },
  { slug: "demo-databridge", name: "DataBridge", city: "toshkent", short: "Ma'lumotlar tahlili va hisobotlar paneli (CloudUz bilan teng summa).", links: { site: true }, entries: [{ category: "it-kompaniyalar", payments: [[700_000, 50]] }] },
  { slug: "demo-cloud-uz", name: "CloudUz", city: "toshkent", short: "Bulutli hosting va server qo'llab-quvvatlash (DataBridge bilan teng summa).", links: { site: true, telegram: true }, entries: [{ category: "it-kompaniyalar", payments: [[700_000, 45]] }] },
  // --- Bizneslar ---
  { slug: "demo-oltin-savdo", name: "Oltin Savdo Group", city: "fargona", short: "Ulgurji savdo va yetkazib berish: oziq-ovqat va xo'jalik mollari.", links: { site: true, telegram: true, instagram: true }, entries: [{ category: "bizneslar", payments: [[2_200_000, 8]] }] },
  { slug: "demo-baraka-market", name: "Baraka Market", city: "samarqand", short: "Mahalla supermarketlari tarmog'i, har kuni yangi mahsulotlar.", links: { instagram: true }, entries: [{ category: "bizneslar", payments: [[600_000, 35]] }] },
  { slug: "demo-yangi-avlod", name: "Yangi Avlod Logistics", city: "toshkent", short: "Yuk tashish va omborxona xizmatlari (muddati tugashiga ~12 kun).", links: { site: true }, entries: [{ category: "bizneslar", payments: [[250_000, 80]] }] },
  { slug: "demo-mini-cafe", name: "Mini Cafe", city: "toshkent", short: "Kichik kofexona: minimal summa va muddati tugashiga ~4 kun qolgan holat.", entries: [{ category: "bizneslar", payments: [[50_000, 88]] }] },
];

async function remove() {
  const ids = (await db.brand.findMany({ where: { slug: { startsWith: "demo-" } }, select: { id: true } })).map((b) => b.id);
  const bcIds = (await db.brandCategory.findMany({ where: { brandId: { in: ids } }, select: { id: true } })).map((b) => b.id);
  await db.payment.deleteMany({ where: { brandCategoryId: { in: bcIds } } });
  await db.brandCategory.deleteMany({ where: { brandId: { in: ids } } });
  await db.brand.deleteMany({ where: { id: { in: ids } } });
  return ids.length;
}

async function main() {
  const removed = await remove();
  if (process.argv.includes("--remove")) {
    console.log(`Demo o'chirildi: ${removed} ta brend`);
    return;
  }

  const admin = await db.adminUser.findFirstOrThrow({ where: { role: "SUPER_ADMIN" } });

  for (const d of DEMO) {
    const brand = await db.brand.create({
      data: {
        slug: d.slug,
        name: d.name,
        shortDescription: d.short,
        fullDescription: `${d.short} Bu yozilish interfeysni sinash uchun yaratilgan DEMO ma'lumot, haqiqiy brend emas.`,
        websiteUrl: d.links?.site ? "https://example.com" : null,
        telegramUrl: d.links?.telegram ? "https://t.me/example" : null,
        instagramUrl: d.links?.instagram ? "https://instagram.com/example" : null,
        city: d.city,
        services: ["Xizmat 1", "Xizmat 2", "Xizmat 3"],
        features: ["Demo xususiyat"],
        status: "ACTIVE",
        createdById: admin.id,
      },
    });

    for (const e of d.entries) {
      const category = await db.category.findUniqueOrThrow({ where: { slug: e.category } });
      const payments = e.payments.map(([amount, days], i) => ({
        amount: BigInt(amount),
        paymentDate: daysAgo(days),
        status: "CONFIRMED" as const,
        reference: `demo-${d.slug}-${e.category}-${i + 1}`,
      }));
      const bc = await db.brandCategory.create({
        data: { brandId: brand.id, categoryId: category.id },
      });
      for (const p of payments) {
        await db.payment.create({
          data: {
            brandCategoryId: bc.id,
            amount: p.amount,
            paymentDate: p.paymentDate,
            reference: p.reference,
            note: "DEMO",
            createdById: admin.id,
          },
        });
      }
      // BrandCategory keshi (src/lib/payments.ts bilan bir xil formula)
      await db.brandCategory.update({
        where: { id: bc.id },
        data: deriveState(payments, DEFAULT_ACTIVE_MONTHS),
      });
    }
  }

  console.log("Demo tayyor:", {
    brands: DEMO.length,
    brandCategories: DEMO.reduce((n, d) => n + d.entries.length, 0),
    payments: DEMO.reduce((n, d) => n + d.entries.reduce((m, e) => m + e.payments.length, 0), 0),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
