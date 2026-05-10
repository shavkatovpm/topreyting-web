import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { listings } from "@/data/listings";
import { getAllArticleSlugs, getArticleBySlug, getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";
import { locales, localeHref } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  const staticPaths = [
    "",
    "/maqolalar",
    "/biz-haqimizda",
    "/qoshish",
    "/qidiruv",
    "/reklama",
    "/maxfiylik",
    "/shartlar",
  ];

  // Active categories — only those with content
  const articleCats = new Set(getAllArticles().map((a) => a.category));
  const listingCats = new Set(listings.map((l) => l.category));
  const activeCatSlugs = new Set([...articleCats, ...listingCats]);

  const cityCatCombos = new Set(listings.map((l) => `${l.category}/${l.city}`));

  for (const lang of locales) {
    // Static pages
    for (const p of staticPaths) {
      out.push({
        url: `${site.url}${localeHref(lang, p)}`,
        lastModified: now,
        changeFrequency: p === "" || p === "/maqolalar" ? "daily" : "monthly",
        priority: p === "" ? 1.0 : p === "/maqolalar" ? 0.95 : 0.5,
      });
    }
    // Categories
    for (const c of categories) {
      if (!activeCatSlugs.has(c.slug)) continue;
      out.push({
        url: `${site.url}${localeHref(lang, `/${c.slug}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    // City × category combos that have listings
    for (const combo of cityCatCombos) {
      out.push({
        url: `${site.url}${localeHref(lang, `/${combo}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    // Listings
    for (const l of listings) {
      out.push({
        url: `${site.url}${localeHref(lang, `/${l.category}/${l.city}/${l.slug}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
    // Articles
    for (const slug of getAllArticleSlugs()) {
      const a = getArticleBySlug(slug);
      if (!a) continue;
      out.push({
        url: `${site.url}${localeHref(lang, `/maqolalar/${slug}`)}`,
        lastModified: new Date(a.updatedAt ?? a.publishedAt),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  return out;
}
