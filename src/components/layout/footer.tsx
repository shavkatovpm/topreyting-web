import Link from "next/link";
import { Logo } from "./logo";
import { Mail, Send } from "lucide-react";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export function Footer() {
  const articleCats = Array.from(new Set(getAllArticles().map((a) => a.category)));
  const activeCategories = getActiveCategories(articleCats);

  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {site.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={site.social.telegram}
                aria-label="Telegram"
                className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-secondary transition-colors"
              >
                <Send size={16} />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-secondary transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              {activeCategories.length > 0 ? "Kategoriyalar" : "Yo'nalishlar"}
            </h4>
            <ul className="space-y-2 text-sm">
              {activeCategories.length > 0 ? (
                activeCategories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {c.namePlural}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted-foreground">Tez orada qo&apos;shiladi</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Sayt</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/maqolalar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maqolalar
                </Link>
              </li>
              <li>
                <Link
                  href="/qidiruv"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Qidiruv
                </Link>
              </li>
              <li>
                <Link
                  href="/biz-haqimizda"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link
                  href="/aloqa"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Aloqa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Boshqa</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/qoshish"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tashkilot taklif qilish
                </Link>
              </li>
              <li>
                <Link
                  href="/maxfiylik"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maxfiylik siyosati
                </Link>
              </li>
              <li>
                <Link
                  href="/shartlar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name}. Barcha huquqlar himoyalangan.
          </p>
          <p>O&apos;zbekiston bozori bo&apos;yicha mustaqil tahlillar</p>
        </div>
      </div>
    </footer>
  );
}
