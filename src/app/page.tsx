import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
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

      {/* ABOUT */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-page py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Top Reyting nima qiladi?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Biz O&apos;zbekiston bozoridagi turli sohalar (klinikalar, agentliklar,
              IT, biznes va boshqalar) haqida mustaqil tahlillar yozamiz.
              Maqolalarimiz aniq raqamlar, qiyoslashlar va amaliy
              maslahatlar asosida yoziladi.
            </p>
            <p className="mt-3 text-muted-foreground">
              Yaqin kelajakda — interaktiv reyting va sharhlar tizimi.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/maqolalar" className={buttonVariants({ size: "default" })}>
                Maqolalarni ko&apos;rish
              </Link>
              <Link
                href="/biz-haqimizda"
                className={buttonVariants({ size: "default", variant: "outline" })}
              >
                Biz haqimizda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Newsletter / partnership */}
      <section className="container-page py-16">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10 p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <Mail size={28} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Hamkor bo&apos;lasizmi?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tashkilotingiz haqida yozishimizni xohlaysizmi yoki Top Reyting bilan
              hamkorlikka qiziqasizmi? Yozing.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/aloqa" className={buttonVariants({ size: "lg" })}>
                Bog&apos;lanish
              </Link>
              <Link
                href="/qoshish"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Tashkilot taklif qilish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd([{ name: "Bosh sahifa", url: "/" }])} />
    </>
  );
}
