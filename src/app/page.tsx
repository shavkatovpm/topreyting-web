import Link from "next/link";
import { ArrowRight, Search, CheckCircle2, BookOpen } from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/cards/article-card";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { Hero } from "@/components/hero/hero";

export default function HomePage() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 6);

  return (
    <>
      <Hero />

      {/* ARTICLES — primary content */}
      {articles.length > 0 ? (
        <section className="container-page py-16">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                So&apos;nggi maqolalar
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Tanlash bo&apos;yicha qo&apos;llanmalar va tahlillar
              </p>
            </div>
            {articles.length > 6 && (
              <Link
                href="/maqolalar"
                className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all font-medium"
              >
                Barchasi
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      ) : (
        <section className="container-page py-20">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-muted-foreground">
              Birinchi maqolalar tez orada chiqadi. Yangiliklar uchun bizni Telegram
              kanalida kuzatib boring.
            </p>
            <a
              href={site.social.telegram}
              className={
                buttonVariants({ size: "default", variant: "outline" }) + " mt-4"
              }
            >
              Telegram kanalga obuna
            </a>
          </div>
        </section>
      )}

      {/* ABOUT — bento-style feature grid */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl mb-10 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-bold mb-3">
              Biz nima qilamiz
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Top Reyting — O&apos;zbekiston bozori bo&apos;yicha mustaqil tahlillar.
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              Klinikalar, agentliklar, IT, bizneslar va boshqa sohalar haqida
              tekshirilgan ma&apos;lumotlarga asoslangan qo&apos;llanmalar.
            </p>
          </div>

          <div className="grid gap-3 md:gap-4 md:grid-cols-3">
            {/* Feature 1 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  01
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Search size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                Mustaqil tahlil
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Bozor o&apos;rganiladi, eng muhim mezonlar ajratiladi. Reklama
                emas — fakt va tahlil.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  02
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                Tekshirilgan ma&apos;lumot
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Har raqam, narx va da&apos;vo tashqi manbadan tekshiriladi.
                Yolg&apos;on yo&apos;q.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="rounded-3xl bg-card border border-border p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl md:text-6xl font-bold tracking-tighter text-primary tabular-nums leading-none">
                  03
                </span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen size={18} />
                </div>
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-2 tracking-tight">
                Foydali qo&apos;llanmalar
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Tanlash mezonlari, qiyoslash jadvallari, savol-javoblar va
                manba linklari.
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-3">
            <Link href="/maqolalar" className={buttonVariants({ size: "lg" })}>
              Maqolalarni ko&apos;rish
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/biz-haqimizda"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Biz haqimizda
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd([{ name: "Bosh sahifa", url: "/" }])} />
    </>
  );
}
