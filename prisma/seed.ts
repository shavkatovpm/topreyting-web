import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";
import { categories } from "../src/data/categories";
import { listings } from "../src/data/listings";
import { getAllArticles } from "../src/lib/articles";
import { locales } from "../src/i18n/config";
import { DEFAULT_ACTIVE_MONTHS, DEFAULT_MIN_PAYMENT } from "../src/lib/ranking";

async function main() {
  // 1. Sozlamalar (mavjud bo'lsa tegmaymiz — admin o'zgartirgan bo'lishi mumkin)
  const defaults: Record<string, string> = {
    minPaymentAmount: DEFAULT_MIN_PAYMENT.toString(),
    activeMonths: String(DEFAULT_ACTIVE_MONTHS),
  };
  for (const [key, value] of Object.entries(defaults)) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  // 2. Super Admin (faqat env berilgan bo'lsa)
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  let adminId: string | undefined;
  if (email && password) {
    const admin = await db.adminUser.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: "Super Admin",
        role: "SUPER_ADMIN",
        passwordHash: await hashPassword(password),
      },
    });
    adminId = admin.id;
  } else {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD yo'q — admin yaratilmadi");
  }

  // 3. Kategoriyalar: saytda hozir ko'rinib turganlari (listing yoki maqolasi bor) ACTIVE, qolganlari UNPUBLISHED
  const withListings = new Set([
    ...listings.map((l) => l.category),
    ...locales.flatMap((loc) => getAllArticles(loc).map((a) => a.category)),
  ]);
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.namePlural,
        h1: c.namePlural,
        seoTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        shortDescription: c.description,
        status: withListings.has(c.slug) ? "ACTIVE" : "UNPUBLISHED",
      },
    });
  }

  // 4. Mavjud listinglar -> Brand (to'lov YO'Q: to'lovni admin qo'lda kiritadi)
  for (const l of listings) {
    const brand = await db.brand.upsert({
      where: { slug: l.slug },
      update: {},
      create: {
        slug: l.slug,
        name: l.name,
        shortDescription: l.shortDescription,
        fullDescription: l.description,
        websiteUrl: l.website,
        phone: l.phone,
        address: l.address,
        city: l.city,
        priceRange: l.priceRange,
        workingHours: l.workingHours,
        yearFounded: l.yearFounded,
        services: l.services,
        features: l.features,
        faqs: l.faqs,
        status: "ACTIVE",
        createdById: adminId,
      },
    });
    const category = await db.category.findUniqueOrThrow({ where: { slug: l.category } });
    await db.brandCategory.upsert({
      where: { brandId_categoryId: { brandId: brand.id, categoryId: category.id } },
      update: {},
      create: { brandId: brand.id, categoryId: category.id },
    });
  }

  const counts = {
    categories: await db.category.count(),
    brands: await db.brand.count(),
    admins: await db.adminUser.count(),
  };
  console.log("Seed tayyor:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
