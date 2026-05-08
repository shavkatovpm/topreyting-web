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
              Bosh sahifa
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">Qidiruv</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Qidiruv</h1>

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
            placeholder="Tashkilot nomini yoki xizmatni yozing..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Qidirish
          </button>
        </form>

        {query && (
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{q}</span> bo&apos;yicha{" "}
            <span className="font-medium text-foreground">{results.length}</span> ta natija
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
            <p className="text-muted-foreground">Hech narsa topilmadi</p>
            <Link href="/" className="text-primary hover:underline text-sm mt-2 inline-block">
              Bosh sahifaga qaytish
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
