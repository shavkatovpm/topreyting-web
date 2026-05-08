import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Logo } from "./logo";
import { CategoriesDropdown } from "./categories-dropdown";
import { buttonVariants } from "@/components/ui/button";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { cn } from "@/lib/utils";

export function Header() {
  const articleCats = Array.from(new Set(getAllArticles().map((a) => a.category)));
  const activeCategories = getActiveCategories(articleCats);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />

        <nav
          aria-label="Asosiy navigatsiya"
          className="hidden md:flex items-center gap-1 text-sm"
        >
          <CategoriesDropdown isEmpty={activeCategories.length === 0}>
            {activeCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-secondary transition-colors"
                >
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br text-white shrink-0",
                      cat.color
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight">
                      {cat.namePlural}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {cat.description.slice(0, 60)}…
                    </p>
                  </div>
                </Link>
              );
            })}
          </CategoriesDropdown>
          <Link
            href="/maqolalar"
            className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors font-medium"
          >
            Maqolalar
          </Link>
          <Link
            href="/biz-haqimizda"
            className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors font-medium"
          >
            Biz haqimizda
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/qidiruv"
            aria-label="Qidiruv"
            className="hidden md:inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary transition-colors min-w-[180px]"
          >
            <Search size={16} />
            <span>Qidirish...</span>
          </Link>

          <Link
            href="/qoshish"
            className={buttonVariants({ size: "sm" }) + " hidden sm:inline-flex"}
          >
            <Plus size={16} />
            <span>E&apos;lon qo&apos;shish</span>
          </Link>

          <Link
            href="/qoshish"
            aria-label="E'lon qo'shish"
            className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <Plus size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
