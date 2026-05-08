import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/data/categories";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <Link
      href={`/${category.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br text-white shrink-0",
            category.color
          )}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">{category.namePlural}</h3>
            <ArrowUpRight
              size={16}
              className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
