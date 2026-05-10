import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "./logo";
import { CategoriesDropdown } from "./categories-dropdown";
import { MobileMenu } from "./mobile-menu";
import { LanguageToggle } from "@/components/language-toggle";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { cn } from "@/lib/utils";

const pageLinks: { href: string; uz: string; ru: string }[] = [
  { href: "/maqolalar", uz: "Maqolalar", ru: "Статьи" },
  { href: "/qidiruv", uz: "Qidiruv", ru: "Поиск" },
  { href: "/biz-haqimizda", uz: "Biz haqimizda", ru: "О нас" },
];

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
            <span data-lang="uz">Maqolalar</span>
            <span data-lang="ru">Статьи</span>
          </Link>
          <Link
            href="/biz-haqimizda"
            className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors font-medium"
          >
            <span data-lang="uz">Biz haqimizda</span>
            <span data-lang="ru">О нас</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/qidiruv"
            aria-label="Qidiruv"
            className="hidden md:inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary transition-colors min-w-[180px]"
          >
            <Search size={16} />
            <span data-lang="uz">Qidirish...</span>
            <span data-lang="ru">Поиск...</span>
          </Link>

          <Link
            href="/qidiruv"
            aria-label="Qidiruv"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
          >
            <Search size={18} />
          </Link>

          <LanguageToggle className="hidden md:inline-flex" />

          <MobileMenu>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              <span data-lang="uz">Kategoriyalar</span>
              <span data-lang="ru">Категории</span>
            </p>
            {activeCategories.length > 0 ? (
              <ul className="space-y-1 mb-6">
                {activeCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.slug}>
                      <Link
                        href={`/${cat.slug}`}
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
                        <span className="font-medium">{cat.namePlural}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground mb-6">
                <span data-lang="uz">Tez orada kategoriyalar qo&apos;shiladi</span>
                <span data-lang="ru">Скоро будут добавлены категории</span>
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              <span data-lang="uz">Sahifalar</span>
              <span data-lang="ru">Страницы</span>
            </p>
            <ul className="space-y-1">
              {pageLinks.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block rounded-lg px-3 py-2.5 hover:bg-secondary transition-colors font-medium"
                  >
                    <span data-lang="uz">{it.uz}</span>
                    <span data-lang="ru">{it.ru}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                <span data-lang="uz">Til</span>
                <span data-lang="ru">Язык</span>
              </p>
              <LanguageToggle />
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
