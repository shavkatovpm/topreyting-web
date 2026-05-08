import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "./logo";
import { CategoriesDropdown } from "./categories-dropdown";
import { MobileMenu } from "./mobile-menu";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { cn } from "@/lib/utils";

const pageLinks = [
  { href: "/maqolalar", label: "Maqolalar" },
  { href: "/qidiruv", label: "Qidiruv" },
  { href: "/biz-haqimizda", label: "Biz haqimizda" },
  { href: "/aloqa", label: "Aloqa" },
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
            href="/qidiruv"
            aria-label="Qidiruv"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
          >
            <Search size={18} />
          </Link>

          <MobileMenu>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Kategoriyalar
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
                Tez orada kategoriyalar qo&apos;shiladi
              </div>
            )}

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Sahifalar
            </p>
            <ul className="space-y-1">
              {pageLinks.map((it) => (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="block rounded-lg px-3 py-2.5 hover:bg-secondary transition-colors font-medium"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
