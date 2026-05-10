import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/cards/article-card";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getAllArticles } from "@/lib/articles";
import { categories } from "@/data/categories";
import { site } from "@/lib/site";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Maqolalar va qo'llanmalar — reyting va tanlash",
  description:
    "O'zbekistondagi klinikalar, agentliklar, bizneslar va mutaxassislarni tanlash bo'yicha mutaxassis maqolalari. Reytinglar, qo'llanmalar va sharhlar.",
  alternates: { canonical: "/maqolalar" },
  openGraph: {
    title: `Maqolalar | ${site.name}`,
    description:
      "Tanlash bo'yicha foydali qo'llanmalar va reytinglar — barchasi bir joyda.",
    url: `${site.url}/maqolalar`,
    type: "website",
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

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
            <span data-lang="uz">Maqolalar</span>
            <span data-lang="ru">Статьи</span>
          </li>
        </ol>
      </nav>

      <header className="container-page py-10 border-b border-border mb-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          <span data-lang="uz">Maqolalar va qo&apos;llanmalar</span>
          <span data-lang="ru">Статьи и руководства</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          <span data-lang="uz">
            O&apos;zbekistondagi klinikalar, agentliklar, mutaxassislar va
            bizneslarni tanlash bo&apos;yicha mutaxassis maqolalari. Reytinglar,
            taqqoslashlar va amaliy qo&apos;llanmalar.
          </span>
          <span data-lang="ru">
            Экспертные статьи о выборе клиник, агентств, специалистов и бизнесов
            в Узбекистане. Рейтинги, сравнения и практические руководства.
          </span>
        </p>
      </header>

      <section className="container-page">
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/maqolalar"
            className="rounded-full border border-primary bg-primary/10 text-primary px-3 py-1 text-sm font-medium"
          >
            <span data-lang="uz">Barchasi</span>
            <span data-lang="ru">Все</span>
          </Link>
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/maqolalar?cat=${c.slug}`}
              className="rounded-full border border-border bg-background hover:bg-secondary px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {c.namePlural}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center">
            <span data-lang="uz">Hozircha maqolalar yo&apos;q.</span>
            <span data-lang="ru">Пока нет статей.</span>
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pb-16">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "Maqolalar", url: "/maqolalar" },
        ])}
      />
    </>
  );
}
