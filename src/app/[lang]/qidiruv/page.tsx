import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { listings } from "@/data/listings";
import { ListingCard } from "@/components/cards/listing-card";
import { ArticleCard } from "@/components/cards/article-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getAllArticles } from "@/lib/articles";
import { getDictionary, isLocale, type Locale } from "@/i18n";

export const metadata: Metadata = {
  title: "Qidiruv — Top Reyting",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);

  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const listingResults = query
    ? listings.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.shortDescription.toLowerCase().includes(query) ||
          l.services.some((s) => s.toLowerCase().includes(query))
      )
    : [];

  const articleResults = query
    ? getAllArticles(locale).filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    : [];

  const totalResults = listingResults.length + articleResults.length;

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
          <li className="text-foreground font-medium">{t.searchPage.title}</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t.searchPage.title}
        </h1>

        <form
          action={`/${locale}/qidiruv`}
          method="GET"
          className="mt-6 max-w-2xl flex items-center gap-2 rounded-xl border border-border bg-card p-2"
        >
          <div className="grid h-10 w-10 place-items-center text-muted-foreground shrink-0">
            <Search size={18} />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder={t.common.searchPlaceholder}
            className="flex-1 bg-transparent outline-none text-base md:text-sm"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t.common.searchVerb}
          </button>
        </form>

        {query && (
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{q}</span>{" "}
            {t.searchPage.resultsBefore}{" "}
            <span className="font-medium text-foreground">{totalResults}</span>{" "}
            {t.searchPage.resultsAfter}
          </p>
        )}

        {query && articleResults.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              {t.searchPage.sectionArticles}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({articleResults.length})
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articleResults.map((a) => (
                <ArticleCard key={a.slug} article={a} lang={locale} />
              ))}
            </div>
          </section>
        )}

        {query && listingResults.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight mb-4">
              {t.searchPage.sectionListings}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({listingResults.length})
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listingResults.map((l) => (
                <ListingCard key={l.slug} listing={l} lang={locale} />
              ))}
            </div>
          </section>
        )}

        {query && totalResults === 0 && (
          <div className="mt-10 text-center py-12 rounded-xl border border-dashed border-border bg-secondary/30">
            <p className="text-muted-foreground">{t.common.nothingFound}</p>
            <Link
              href={`/${locale}`}
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              {t.common.backHome}
            </Link>
          </div>
        )}
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.common.home, url: `/${locale}` },
          { name: t.searchPage.title, url: `/${locale}/qidiruv` },
        ])}
      />
    </>
  );
}
