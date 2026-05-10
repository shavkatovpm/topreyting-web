import type { Metadata } from "next";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { listings } from "@/data/listings";
import { ListingCard } from "@/components/cards/listing-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Qidiruv — Top Reyting",
  description: "Top Reyting platformasida tashkilot, biznes va xizmatlarni qidiring.",
  alternates: { canonical: "/qidiruv" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const results = query
    ? listings.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.shortDescription.toLowerCase().includes(query) ||
          l.services.some((s) => s.toLowerCase().includes(query))
      )
    : [];

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              <span data-lang="uz">Bosh sahifa</span>
              <span data-lang="ru">Главная</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">
            <span data-lang="uz">Qidiruv</span>
            <span data-lang="ru">Поиск</span>
          </li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          <span data-lang="uz">Qidiruv</span>
          <span data-lang="ru">Поиск</span>
        </h1>

        <form
          action="/qidiruv"
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
            placeholder="..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <span data-lang="uz">Qidirish</span>
            <span data-lang="ru">Найти</span>
          </button>
        </form>

        {query && (
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{q}</span>{" "}
            <span data-lang="uz">
              bo&apos;yicha{" "}
              <span className="font-medium text-foreground">{results.length}</span>{" "}
              ta natija
            </span>
            <span data-lang="ru">
              — найдено{" "}
              <span className="font-medium text-foreground">{results.length}</span>
            </span>
          </p>
        )}

        {query && results.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="mt-10 text-center py-12 rounded-xl border border-dashed border-border bg-secondary/30">
            <p className="text-muted-foreground">
              <span data-lang="uz">Hech narsa topilmadi</span>
              <span data-lang="ru">Ничего не найдено</span>
            </p>
            <Link
              href="/"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              <span data-lang="uz">Bosh sahifaga qaytish</span>
              <span data-lang="ru">Вернуться на главную</span>
            </Link>
          </div>
        )}
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "Qidiruv", url: "/qidiruv" },
        ])}
      />
    </>
  );
}
