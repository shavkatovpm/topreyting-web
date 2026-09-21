import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAllArticleSlugs, getArticleBySlug, getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/cards/article-card";
import { JsonLd } from "@/components/json-ld";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { getCategory } from "@/data/categories";

import { isLocale, locales, type Locale } from "@/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const slug of getAllArticleSlugs(lang)) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const article = getArticleBySlug(slug, lang);
  if (!article) return {};

  const url = `${site.url}/maqolalar/${slug}`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: article.author ? [{ name: article.author.name }] : undefined,
    alternates: { canonical: `/maqolalar/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: article.author ? [article.author.name] : undefined,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const article = getArticleBySlug(slug, locale);

  if (!article) notFound();

  const category = getCategory(article.category);
  const related = getAllArticles(locale)
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  const date = new Date(article.publishedAt).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            <Link href={`/${locale}/maqolalar`} className="hover:text-foreground">
              <span data-lang="uz">Maqolalar</span>
              <span data-lang="ru">Статьи</span>
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground line-clamp-1">{article.title}</li>
        </ol>
      </nav>

      <article className="container-page py-10">
        <div className="max-w-3xl mx-auto">
          {category && (
            <Link
              href={`/${locale}/${category.slug}`}
              className="text-sm text-primary inline-flex items-center gap-1 mb-4 hover:gap-2 transition-all"
            >
              <ArrowLeft size={14} />
              {category.namePlural}
            </Link>
          )}

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-border py-4">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-medium leading-tight">
                    {article.author.name}
                  </p>
                  <p className="text-xs leading-tight">{article.author.role}</p>
                </div>
              </div>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {article.readingTimeMinutes}{" "}
              <span data-lang="uz">daq. o&apos;qish</span>
              <span data-lang="ru">мин чтения</span>
            </span>
          </div>

          <div className="prose-article mt-10">
            <MDXRemote
              source={article.body}
              components={{
                table: (props) => (
                  <div className="table-wrap">
                    <table {...props} />
                  </div>
                ),
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>

          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-16 border-t border-border pt-10" id="savol-javob">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                <span data-lang="uz">Savol-javoblar</span>
                <span data-lang="ru">Вопросы и ответы</span>
              </h2>
              <div className="space-y-3">
                {article.faqs.map((faq, i) => (
                  <details
                    key={i}
                    name={`faq-${slug}`}
                    className="group rounded-lg border border-border bg-card p-5 open:bg-secondary/30 transition-colors"
                  >
                    <summary className="font-semibold cursor-pointer list-none flex items-start justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-primary group-open:rotate-45 transition-transform shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30">
          <div className="container-page py-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              <span data-lang="uz">O&apos;xshash maqolalar</span>
              <span data-lang="ru">Похожие статьи</span>
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} lang={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([
            { name: "Bosh sahifa", url: "/" },
            { name: "Maqolalar", url: "/maqolalar" },
            { name: article.title, url: `/maqolalar/${slug}` },
          ]),
          ...(article.faqs && article.faqs.length > 0 ? [faqJsonLd(article.faqs)] : []),
        ]}
      />
    </>
  );
}
