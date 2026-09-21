import Link from "next/link";
import { ArrowRight, Search, CheckCircle2, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/cards/article-card";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { getHomeRanking } from "@/lib/public-data";
import { BrandRow } from "@/components/ranking/brand-row";
import { PaidNotice } from "@/components/ranking/paid-notice";
import { JoinButton } from "@/components/join/join-button";

// Reyting muddat tugashi bilan o'zgaradi; admin o'zgartirsa darhol yangilanadi (revalidatePublic)
export const revalidate = 600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);

  const articles = getAllArticles(locale);
  const latestArticles = articles.slice(0, 6);
  const ranking = await getHomeRanking();

  return (
    <>
      <section id="reyting" className="container-page py-10 md:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t.hero.title}</h1>
            <p className="mt-2 text-muted-foreground">{t.rank.sub}</p>
          </div>
          <JoinButton>{t.join.cta}</JoinButton>
        </div>
        <div className="mb-6">
          <PaidNotice lang={locale} />
        </div>
        {ranking.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="mb-4 text-muted-foreground">{t.rank.emptyAll}</p>
            <JoinButton>{t.rank.beFirst}</JoinButton>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((item) => (
              <BrandRow key={item.brand.id} item={item} lang={locale} />
            ))}
          </div>
        )}
      </section>

      {articles.length > 0 ? (
        <section className="container-page py-16">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t.home.latestArticles}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {t.home.latestArticlesSub}
              </p>
            </div>
            {articles.length > 6 && (
              <Link
                href={`/${locale}/maqolalar`}
                className="text-sm text-primary inline-flex items-center gap-1 hover:gap-2 transition-all font-medium"
              >
                {t.common.allItems}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((a) => (
              <ArticleCard key={a.slug} article={a} lang={locale} />
            ))}
          </div>
        </section>
      ) : (
        <section className="container-page py-20">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-muted-foreground">{t.home.noArticles}</p>
            <a
              href={site.social.telegram}
              className={
                buttonVariants({ size: "default", variant: "outline" }) + " mt-4"
              }
            >
              {t.home.telegramSubscribe}
            </a>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-secondary/30">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-3xl mb-10 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-bold mb-3">
              {t.home.aboutEyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              {t.home.aboutTitle}
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
              {t.home.aboutSubtitle}
            </p>
          </div>

          <div className="grid gap-3 md:gap-4 md:grid-cols-3">
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
                {t.home.feature1Title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t.home.feature1Text}
              </p>
            </article>

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
                {t.home.feature2Title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t.home.feature2Text}
              </p>
            </article>

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
                {t.home.feature3Title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t.home.feature3Text}
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-3">
            <Link href={`/${locale}/maqolalar`} className={buttonVariants({ size: "lg" })}>
              {t.home.showArticles}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/${locale}/biz-haqimizda`}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              {t.common.aboutUs}
            </Link>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([{ name: t.common.home, url: `/${locale}` }])}
      />
    </>
  );
}
