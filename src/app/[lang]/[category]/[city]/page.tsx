import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { categories, getCategory } from "@/data/categories";
import { cities, getCity } from "@/data/cities";
import { listings } from "@/data/listings";
import { ListingCard } from "@/components/cards/listing-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { locales, isLocale, type Locale } from "@/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { lang: string; category: string; city: string }[] = [];
  for (const lang of locales) {
    for (const cat of categories) {
      for (const city of cities) {
        params.push({ lang, category: cat.slug, city: city.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string; city: string }>;
}): Promise<Metadata> {
  const { lang, category: catSlug, city: citySlug } = await params;
  const category = getCategory(catSlug);
  const city = getCity(citySlug);
  if (!category || !city) return {};

  const title = `${city.name} ${category.namePlural} | Top Reyting`;
  const description = `${city.name}: ${category.namePlural}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/${catSlug}/${citySlug}`,
      languages: {
        uz: `/uz/${catSlug}/${citySlug}`,
        ru: `/ru/${catSlug}/${citySlug}`,
        "x-default": `/uz/${catSlug}/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${site.url}/${lang}/${catSlug}/${citySlug}`,
      type: "website",
    },
  };
}

export default async function CategoryCityPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; city: string }>;
}) {
  const { lang, category: catSlug, city: citySlug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const category = getCategory(catSlug);
  const city = getCity(citySlug);

  if (!category || !city) notFound();

  const cityListings = listings
    .filter((l) => l.category === catSlug && l.city === citySlug)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
          <li>
            <Link href={`/${locale}`} className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link href={`/${locale}/${catSlug}`} className="hover:text-foreground">
              {category.namePlural}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">{city.name}</li>
        </ol>
      </nav>

      <header className="container-page py-10 border-b border-border">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          <span data-lang="uz">
            {city.name} shahridagi eng yaxshi {category.namePlural.toLowerCase()}
          </span>
          <span data-lang="ru">
            Лучшие {category.namePlural.toLowerCase()} в городе {city.name}
          </span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          <span data-lang="uz">
            {city.name} ({city.region}) dagi {category.namePlural.toLowerCase()}{" "}
            reytingi. Bemorlar/mijozlar baholari va sharhlari asosida tartibga
            solingan.
          </span>
          <span data-lang="ru">
            Рейтинг {category.namePlural.toLowerCase()} в городе {city.name} (
            {city.region}). Упорядочено на основе оценок и отзывов
            пациентов/клиентов.
          </span>
        </p>
      </header>

      <section className="container-page py-10">
        {cityListings.length === 0 ? (
          <div className="text-center py-20">
            <MapPin size={40} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-2">
              <span data-lang="uz">
                {city.name}da {category.namePlural.toLowerCase()} hozircha
                qo&apos;shilmagan.
              </span>
              <span data-lang="ru">
                В городе {city.name} {category.namePlural.toLowerCase()} пока
                не добавлены.
              </span>
            </p>
            <Link href={`/${locale}/qoshish`} className="text-primary hover:underline text-sm">
              <span data-lang="uz">Birinchi bo&apos;lib qo&apos;shing →</span>
              <span data-lang="ru">Добавьте первым →</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cityListings.map((l) => (
              <ListingCard key={l.slug} listing={l} showRank lang={locale} />
            ))}
          </div>
        )}
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Bosh sahifa", url: "/" },
            { name: category.namePlural, url: `/${catSlug}` },
            { name: city.name, url: `/${catSlug}/${citySlug}` },
          ]),
          itemListJsonLd(cityListings, catSlug),
        ]}
      />
    </>
  );
}
