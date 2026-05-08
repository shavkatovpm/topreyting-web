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

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { category: string; city: string }[] = [];
  for (const cat of categories) {
    for (const city of cities) {
      params.push({ category: cat.slug, city: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}): Promise<Metadata> {
  const { category: catSlug, city: citySlug } = await params;
  const category = getCategory(catSlug);
  const city = getCity(citySlug);
  if (!category || !city) return {};

  const title = `${city.name} shahridagi eng yaxshi ${category.namePlural.toLowerCase()} 2026 | Top Reyting`;
  const description = `${city.name}dagi eng yaxshi ${category.namePlural.toLowerCase()} reytingi. Reyting, sharhlar, manzil, telefon va kontakt ma'lumotlari.`;

  return {
    title,
    description,
    alternates: { canonical: `/${catSlug}/${citySlug}` },
    openGraph: {
      title,
      description,
      url: `${site.url}/${catSlug}/${citySlug}`,
      type: "website",
    },
  };
}

export default async function CategoryCityPage({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}) {
  const { category: catSlug, city: citySlug } = await params;
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
            <Link href="/" className="hover:text-foreground">
              Bosh sahifa
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link href={`/${catSlug}`} className="hover:text-foreground">
              {category.namePlural}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">{city.name}</li>
        </ol>
      </nav>

      <header className="container-page py-10 border-b border-border">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          {city.name} shahridagi eng yaxshi {category.namePlural.toLowerCase()}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          {city.name} ({city.region}) dagi {category.namePlural.toLowerCase()} reytingi.
          Bemorlar/mijozlar baholari va sharhlari asosida tartibga solingan.
        </p>
      </header>

      <section className="container-page py-10">
        {cityListings.length === 0 ? (
          <div className="text-center py-20">
            <MapPin size={40} className="mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-2">
              {city.name}da {category.namePlural.toLowerCase()} hozircha qo&apos;shilmagan.
            </p>
            <Link href="/qoshish" className="text-primary hover:underline text-sm">
              Birinchi bo&apos;lib qo&apos;shing →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cityListings.map((l) => (
              <ListingCard key={l.slug} listing={l} showRank />
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
