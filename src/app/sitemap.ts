import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { listings } from "@/data/listings";
import { getAllArticleSlugs, getArticleBySlug, getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${site.url}/maqolalar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${site.url}/biz-haqimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.url}/aloqa`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${site.url}/qoshish`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Only include category pages that are relevant — those with articles or listings
  const articleCats = new Set(getAllArticles().map((a) => a.category));
  const listingCats = new Set(listings.map((l) => l.category));
  const activeCatSlugs = new Set([...articleCats, ...listingCats]);

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => activeCatSlugs.has(c.slug))
    .map((c) => ({
      url: `${site.url}/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Only category × city combos that actually have a listing
  const cityCatCombos = new Set(listings.map((l) => `${l.category}/${l.city}`));
  const categoryCityPages: MetadataRoute.Sitemap = Array.from(cityCatCombos).map(
    (combo) => ({
      url: `${site.url}/${combo}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${site.url}/${l.category}/${l.city}/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticleSlugs()
    .map((slug) => {
      const a = getArticleBySlug(slug);
      if (!a) return null;
      return {
        url: `${site.url}/maqolalar/${slug}`,
        lastModified: new Date(a.updatedAt ?? a.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return [
    ...staticPages,
    ...articlePages,
    ...categoryPages,
    ...categoryCityPages,
    ...listingPages,
  ];
}
