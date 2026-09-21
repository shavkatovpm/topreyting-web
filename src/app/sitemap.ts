import type { MetadataRoute } from "next";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { getSitemapData } from "@/lib/public-data";
import { site } from "@/lib/site";
import { locales, localeHref } from "@/i18n/config";

// Muddati tugagan/yashirin brendlar sitemap'da bo'lmasligi uchun tez-tez yangilanadi
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];
  const { categories, brands } = await getSitemapData();

  const staticPaths = ["", "/maqolalar", "/biz-haqimizda", "/qoshish", "/reklama", "/maxfiylik", "/shartlar"];

  for (const lang of locales) {
    // Statik sahifalar (lastModified yolg'on "hozir" bo'lmasligi uchun ko'rsatilmaydi)
    for (const p of staticPaths) {
      out.push({
        url: `${site.url}${localeHref(lang, p)}`,
        changeFrequency: p === "" || p === "/maqolalar" ? "daily" : "monthly",
        priority: p === "" ? 1.0 : p === "/maqolalar" ? 0.95 : 0.5,
      });
    }
    // Maqolalar — faqat shu tilda mavjud bo'lganlari
    for (const slug of getAllArticleSlugs(lang)) {
      const a = getArticleBySlug(slug, lang);
      if (!a) continue;
      out.push({
        url: `${site.url}${localeHref(lang, `/maqolalar/${slug}`)}`,
        lastModified: new Date(a.updatedAt ?? a.publishedAt),
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  // Kategoriya va brend kontenti hozircha faqat o'zbek tilida (RU sahifalar UZ'ga canonical),
  // shuning uchun faqat UZ manzillar sitemap'ga kiradi.
  for (const c of categories) {
    out.push({
      url: `${site.url}${localeHref("uz", `/${c.slug}`)}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const b of brands) {
    out.push({
      url: `${site.url}${localeHref("uz", `/${b.categorySlug}/${b.slug}`)}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return out;
}
