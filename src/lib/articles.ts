import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/i18n";
import { defaultLocale } from "@/i18n";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  cover?: string;
  featured?: boolean;
  faqs?: { q: string; a: string }[];
};

export type Article = ArticleFrontmatter & {
  body: string;
  readingTimeMinutes: number;
  locale: Locale;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function localeDir(locale: Locale): string {
  return path.join(ARTICLES_DIR, locale);
}

export function getAllArticleSlugs(locale: Locale = defaultLocale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getArticleBySlug(
  slug: string,
  locale: Locale = defaultLocale
): Article | null {
  const dir = localeDir(locale);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    ...(data as ArticleFrontmatter),
    slug,
    body: content,
    readingTimeMinutes: Math.ceil(stats.minutes),
    locale,
  };
}

export function getAllArticles(locale: Locale = defaultLocale): Article[] {
  return getAllArticleSlugs(locale)
    .map((slug) => getArticleBySlug(slug, locale))
    .filter((a): a is Article => a !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getFeaturedArticles(
  limit: number = 3,
  locale: Locale = defaultLocale
): Article[] {
  return getAllArticles(locale)
    .filter((a) => a.featured)
    .slice(0, limit);
}

export function getArticlesByCategory(
  category: string,
  locale: Locale = defaultLocale
): Article[] {
  return getAllArticles(locale).filter((a) => a.category === category);
}
