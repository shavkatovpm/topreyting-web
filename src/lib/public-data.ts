import "server-only";
import type { Brand, Category } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
  expiringInDays,
  globalScores,
  rankEntries,
  tierFor,
  type Tier,
} from "@/lib/ranking";

/**
 * Public sahifalar uchun ma'lumotlar. Reyting HAR DOIM shu yerda to'lovlardan hisoblanadi.
 * Ko'rinish qoidasi: brend ACTIVE + kategoriya ACTIVE + to'lov muddati (activeUntil) tugamagan.
 */

export type RankedBrand = {
  brand: Brand;
  rank: number;
  total: bigint;
  tier: Tier;
  /** Muddati yaqin bo'lsa necha kun qolgani, aks holda null */
  expiresInDays: number | null;
  categories: { slug: string; name: string }[];
};

export async function getPublicCategories(): Promise<Category[]> {
  return db.category.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } });
}

/** Bosh sahifa: barcha faol brendlar, kategoriyalar bo'yicha jami summa asosida. */
export async function getHomeRanking(now = new Date()): Promise<RankedBrand[]> {
  const rows = await db.brandCategory.findMany({
    where: { brand: { status: "ACTIVE" }, category: { status: "ACTIVE" } },
    include: { brand: true, category: true },
  });

  const active = rowsActive(rows, now);
  const scores = globalScores(active, now);
  const byBrand = new Map<string, typeof active>();
  for (const r of active) byBrand.set(r.brandId, [...(byBrand.get(r.brandId) ?? []), r]);

  return scores.map((s) => {
    const list = byBrand.get(s.brandId)!;
    const soonest = list
      .map((r) => r.activeUntil)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime())[0] ?? null;
    return {
      brand: list[0].brand,
      rank: s.rank,
      total: s.totalPaid,
      tier: tierFor(s.rank, scores.length),
      expiresInDays: expiringInDays(soonest, now),
      categories: list.map((r) => ({ slug: r.category.slug, name: r.category.name })),
    };
  });
}

function rowsActive<T extends { totalPaid: bigint; activeUntil: Date | null; brandId: string; reachedAt: Date | null }>(
  rows: T[],
  now: Date
) {
  return rows.filter((r) => r.totalPaid > 0n && r.activeUntil !== null && r.activeUntil > now);
}

/** Kategoriya sahifasi: faqat shu kategoriyadagi faol brendlar, shu kategoriya summasi bo'yicha. */
export async function getCategoryRanking(slug: string, now = new Date()) {
  const category = await db.category.findFirst({ where: { slug, status: "ACTIVE" } });
  if (!category) return null;

  const rows = await db.brandCategory.findMany({
    where: { categoryId: category.id, brand: { status: "ACTIVE" } },
    include: { brand: true },
  });
  const ranked = rankEntries(rows, now);
  const items: RankedBrand[] = ranked.map((r) => ({
    brand: r.brand,
    rank: r.rank,
    total: r.totalPaid,
    tier: tierFor(r.rank, ranked.length),
    expiresInDays: expiringInDays(r.activeUntil, now),
    categories: [{ slug: category.slug, name: category.name }],
  }));
  return { category, items };
}

/** Brend sahifasi. Reyting yo'q (muddati tugagan/yashirin) bo'lsa null. */
export async function getBrandPage(categorySlug: string, brandSlug: string, now = new Date()) {
  const data = await getCategoryRanking(categorySlug, now);
  if (!data) return null;
  const current = data.items.find((i) => i.brand.slug === brandSlug);
  if (!current) return null;
  const allCats = await db.brandCategory.findMany({
    where: { brandId: current.brand.id, category: { status: "ACTIVE" }, activeUntil: { gt: now } },
    include: { category: true },
  });
  return {
    category: data.category,
    current,
    others: data.items.filter((i) => i.brand.id !== current.brand.id).slice(0, 3),
    totalInCategory: data.items.length,
    otherCategories: allCats
      .filter((c) => c.category.slug !== categorySlug)
      .map((c) => ({ slug: c.category.slug, name: c.category.name })),
  };
}

/** Eski/o'zgargan slug -> yangi slug (301 uchun) */
export async function resolveSlugRedirect(entityType: "brand" | "category", oldSlug: string) {
  const h = await db.slugHistory.findUnique({
    where: { entityType_oldSlug: { entityType, oldSlug } },
  });
  if (!h) return null;
  if (entityType === "brand") {
    return (await db.brand.findUnique({ where: { id: h.entityId }, select: { slug: true } }))?.slug ?? null;
  }
  return (await db.category.findUnique({ where: { id: h.entityId }, select: { slug: true } }))?.slug ?? null;
}

/** Sitemap uchun: ko'rinadigan kategoriyalar va brend URL'lari */
export async function getSitemapData(now = new Date()) {
  const categories = await getPublicCategories();
  const rows = await db.brandCategory.findMany({
    where: {
      totalPaid: { gt: 0 },
      activeUntil: { gt: now },
      brand: { status: "ACTIVE" },
      category: { status: "ACTIVE" },
    },
    include: { brand: true, category: true },
  });
  return {
    categories: categories.map((c) => ({ slug: c.slug, updatedAt: c.updatedAt })),
    brands: rows.map((r) => ({
      categorySlug: r.category.slug,
      slug: r.brand.slug,
      updatedAt: r.brand.updatedAt,
    })),
  };
}

/** Qidiruv: brend nomi va boshqa yozilishlar bo'yicha (faqat ko'rinadigan brendlar). */
export async function searchBrands(query: string, now = new Date()) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const all = await getHomeRanking(now);
  return all.filter(({ brand }) => {
    const alts = Array.isArray(brand.alternateNames) ? (brand.alternateNames as string[]) : [];
    return [brand.name, brand.shortDescription, ...alts].some((s) => s.toLowerCase().includes(q));
  });
}
