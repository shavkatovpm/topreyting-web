import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { BoardProvider, Board, CategoryBar } from "@/components/home/home-board";
import { AlertIcon, ArrowIcon, PlusIcon } from "@/components/home/icons";
import { JoinButton } from "@/components/join/join-button";
import { JsonLd } from "@/components/json-ld";
import { getAllArticles } from "@/lib/articles";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonld";
import { getHomeBoard } from "@/lib/public-data";
import { getSettings } from "@/lib/settings";
import { getDictionary, isLocale, localeHref, type Locale } from "@/i18n";

// Reyting muddat tugashi bilan o'zgaradi; admin o'zgartirsa darhol yangilanadi (revalidatePublic)
export const revalidate = 600;

const spaced = (n: bigint | number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = dict.nv;

  const [board, settings] = await Promise.all([getHomeBoard(), getSettings()]);
  const articles = getAllArticles(locale).slice(0, 6);
  const minText = `${spaced(settings.minPaymentAmount)} ${t.som}`;
  const min = spaced(settings.minPaymentAmount);
  const months = settings.activeMonths;

  return (
    <BoardProvider
      data={board}
      lang={locale}
      t={t}
      minText={minText}
      months={months}
      notice={dict.rank.notice}
    >
      <CategoryBar />

      <main className="wrap">
        <section className="hero compact-hero">
          <div>
            <h1>
              {t.heroA} <span>{t.heroB}</span>
            </h1>
            <p>
              {t.heroText} <span>{fill(t.heroStart, { min })}</span>
            </p>
          </div>
          <JoinButton unstyled className="btn primary">
            {t.heroCta} <ArrowIcon />
          </JoinButton>
        </section>

        <Board />

        <section className="join-banner">
          <div>
            <h3>{t.bannerTitle}</h3>
            <p>{fill(t.bannerText, { min })}</p>
          </div>
          <JoinButton unstyled className="btn primary">
            {t.bannerCta} <PlusIcon />
          </JoinButton>
        </section>

        <section className="how" id="qanday">
          <div className="how-head">
            <h2>{t.howTitle}</h2>
            <span>{t.howSub}</span>
          </div>
          <div className="steps">
            {t.steps.map((s, i) => (
              <div className="step" key={s.t}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{s.t}</strong>
                  <p>{fill(s.p, { min })}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="risk-info">
          <AlertIcon />
          <p>
            <strong>{t.riskStrong}</strong>
            {fill(t.riskText, { months })}
          </p>
        </div>
      </main>

      {articles.length > 0 && (
        <section className="wrap articles" aria-labelledby="articles-title">
          <h2 id="articles-title">{t.articles}</h2>
          <p className="articles-sub">{t.articlesSub}</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} lang={locale} />
            ))}
          </div>
          <p className="articles-sub" style={{ marginTop: 18 }}>
            <Link href={localeHref(locale, "/maqolalar")}>{dict.common.allItems} →</Link>
          </p>
        </section>
      )}

      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: dict.common.home, url: localeHref(locale) }]),
          ...(board.all.length
            ? [
                itemListJsonLd(
                  board.all.slice(0, 10).map((b) => ({ name: b.name, slug: b.slug, categorySlug: b.categorySlug })),
                ),
              ]
            : []),
        ]}
      />
    </BoardProvider>
  );
}
