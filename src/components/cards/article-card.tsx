import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  const date = new Date(article.publishedAt).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-md">
      <div
        className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-secondary to-gold/10 relative"
        aria-hidden
      >
        <div className="absolute inset-0 grid place-items-center text-6xl font-bold text-primary/20">
          TR
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
            {article.readingTimeMinutes} daq.
          </span>
        </div>
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
          <Link href={`/maqolalar/${article.slug}`} className="hover:text-primary transition-colors">
            <span className="absolute inset-0" aria-hidden />
            {article.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.description}
        </p>
        {article.author ? (
          <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {article.author.name.charAt(0)}
            </div>
            <div className="text-xs">
              <p className="font-medium leading-tight">{article.author.name}</p>
              <p className="text-muted-foreground leading-tight">{article.author.role}</p>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-3 border-t border-border" />
        )}
      </div>
    </article>
  );
}
