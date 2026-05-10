import Link from "next/link";
import { Logo } from "./logo";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export function Footer() {
  const articleCats = Array.from(new Set(getAllArticles().map((a) => a.category)));
  const activeCategories = getActiveCategories(articleCats);
  const hasCategories = activeCategories.length > 0;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              <span data-lang="uz">{site.tagline}</span>
              <span data-lang="ru">
                Независимые руководства по выбору лучших в Узбекистане
              </span>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              {hasCategories ? (
                <>
                  <span data-lang="uz">Kategoriyalar</span>
                  <span data-lang="ru">Категории</span>
                </>
              ) : (
                <>
                  <span data-lang="uz">Yo&apos;nalishlar</span>
                  <span data-lang="ru">Направления</span>
                </>
              )}
            </h4>
            <ul className="space-y-2 text-sm">
              {hasCategories ? (
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
                <li className="text-xs text-muted-foreground">
                  <span data-lang="uz">Tez orada qo&apos;shiladi</span>
                  <span data-lang="ru">Скоро будут добавлены</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              <span data-lang="uz">Sayt</span>
              <span data-lang="ru">Сайт</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/maqolalar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Maqolalar</span>
                  <span data-lang="ru">Статьи</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/qidiruv"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Qidiruv</span>
                  <span data-lang="ru">Поиск</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/biz-haqimizda"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Biz haqimizda</span>
                  <span data-lang="ru">О нас</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              <span data-lang="uz">Boshqa</span>
              <span data-lang="ru">Другое</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/qoshish"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Tashkilot taklif qilish</span>
                  <span data-lang="ru">Предложить организацию</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/maxfiylik"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Maxfiylik siyosati</span>
                  <span data-lang="ru">Политика конфиденциальности</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shartlar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span data-lang="uz">Foydalanish shartlari</span>
                  <span data-lang="ru">Условия использования</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name}.{" "}
            <span data-lang="uz">Barcha huquqlar himoyalangan.</span>
            <span data-lang="ru">Все права защищены.</span>
          </p>
          <p>
            <span data-lang="uz">
              O&apos;zbekiston bozori bo&apos;yicha mustaqil tahlillar
            </span>
            <span data-lang="ru">
              Независимые анализы рынка Узбекистана
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
