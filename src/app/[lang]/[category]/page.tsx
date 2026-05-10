import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Trophy } from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { cities } from "@/data/cities";
import { getListingsByCategory } from "@/data/listings";
import { ListingCard } from "@/components/cards/listing-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { locales, isLocale, type Locale } from "@/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { lang: string; category: string }[] = [];
  for (const lang of locales) {
    for (const c of categories) {
      params.push({ lang, category: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `${site.url}/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const category = getCategory(slug);
  if (!category) notFound();

  const listings = getListingsByCategory(slug);
  const Icon = category.icon;

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">{category.namePlural}</li>
        </ol>
      </nav>

      <header className="container-page py-10 border-b border-border">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${category.color} text-white shrink-0`}
          >
            <Icon size={26} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span data-lang="uz">
                O&apos;zbekistondagi eng yaxshi {category.namePlural.toLowerCase()}
              </span>
              <span data-lang="ru">
                Лучшие {category.namePlural.toLowerCase()} в Узбекистане
              </span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-3xl">
              {category.description}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <span data-lang="uz">Mustaqil tahlillar va qo&apos;llanmalar asosida</span>
              <span data-lang="ru">На основе независимых анализов и руководств</span>
            </p>
          </div>
        </div>
      </header>

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/${locale}/${slug}`}
            className="rounded-full border border-primary bg-primary/10 text-primary px-3 py-1 text-sm font-medium inline-flex items-center gap-1"
          >
            <MapPin size={12} />
            <span data-lang="uz">Hammasi</span>
            <span data-lang="ru">Все</span>
          </Link>
          {cities.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/${slug}/${c.slug}`}
              className="rounded-full border border-border bg-background hover:bg-secondary px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <MapPin size={12} />
              {c.name}
            </Link>
          ))}
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={40} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-2">
              <span data-lang="uz">
                Bu kategoriya bo&apos;yicha hozircha ro&apos;yxatlar yo&apos;q.
              </span>
              <span data-lang="ru">
                В этой категории пока нет записей.
              </span>
            </p>
            <Link href={`/${locale}/qoshish`} className="text-primary hover:underline text-sm">
              <span data-lang="uz">Birinchi bo&apos;lib qo&apos;shing →</span>
              <span data-lang="ru">Добавьте первым →</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.slug} listing={l} showRank lang={locale} />
            ))}
          </div>
        )}
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Bosh sahifa", url: "/" },
            { name: category.namePlural, url: `/${slug}` },
          ]),
          itemListJsonLd(listings, slug),
        ]}
      />
    </>
  );
}
