import Link from "next/link";
import { Clock, Calendar, FileText } from "lucide-react";
import type { Article } from "@/lib/articles";
import { getCategory } from "@/data/categories";
import { getDictionary, type Locale } from "@/i18n";

export function ArticleCard({
  article,
  lang,
}: {
  article: Article;
  lang: Locale;
}) {
  const t = getDictionary(lang);
  const category = getCategory(article.category);
  const Icon = category?.icon ?? FileText;
  const gradient = category?.color ?? "from-primary to-gold";
  const date = new Date(article.publishedAt).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "uz-UZ",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
      <div
        className={`aspect-[16/9] bg-gradient-to-br ${gradient} relative`}
        aria-hidden
      >
        <div className="absolute inset-0 grid place-items-center text-white/95">
          <Icon size={56} strokeWidth={1.5} />
        </div>
      </div>
      <div className="flex flex-col p-5 flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {article.readingTimeMinutes} {t.common.minShort}
          </span>
        </div>
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
          <Link
            href={`/${lang}/maqolalar/${article.slug}`}
            className="hover:text-primary transition-colors"
          >
            <span className="absolute inset-0" aria-hidden />
            {article.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.description}
        </p>
        <div className="mt-auto pt-3 border-t border-border" />
      </div>
    </article>
  );
}
