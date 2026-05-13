import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/cards/article-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getAllArticles } from "@/lib/articles";
import { categories } from "@/data/categories";
import { site } from "@/lib/site";
import { getDictionary, isLocale, locales, localeHref, type Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.articles.pageTitle,
    description: t.articles.pageSub,
    alternates: {
      canonical: localeHref(lang, "/maqolalar"),
      languages: {
        uz: localeHref("uz", "/maqolalar"),
        ru: localeHref("ru", "/maqolalar"),
        "x-default": localeHref("uz", "/maqolalar"),
      },
    },
    openGraph: {
      title: `${t.articles.pageTitle} | ${site.name}`,
      description: t.articles.pageSub,
      url: `${site.url}${localeHref(lang, "/maqolalar")}`,
      type: "website",
    },
  };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);
  const articles = getAllArticles(locale);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="hover:text-foreground">
              {t.common.home}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">{t.common.articles}</li>
        </ol>
      </nav>

      <header className="container-page py-10 border-b border-border mb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          {t.articles.pageTitle}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">{t.articles.pageSub}</p>
      </header>

      <section className="container-page">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/${locale}/maqolalar`}
            className="rounded-full border border-primary bg-primary/10 text-primary px-3 py-1 text-sm font-medium"
          >
            {t.common.allItems}
          </Link>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/maqolalar?cat=${c.slug}`}
              className="rounded-full border border-border bg-background hover:bg-secondary px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {c.namePlural}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center">
            {t.articles.none}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} lang={locale} />
            ))}
          </div>
        )}
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.common.home, url: `/${locale}` },
          { name: t.common.articles, url: `/${locale}/maqolalar` },
        ])}
      />
    </>
  );
}
