import Link from "next/link";
import { Logo } from "./logo";
import { getActiveCategories } from "@/data/categories";
import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site";
import { getDictionary, type Locale } from "@/i18n";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const articleCats = Array.from(new Set(getAllArticles().map((a) => a.category)));
  const activeCategories = getActiveCategories(articleCats);
  const hasCategories = activeCategories.length > 0;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/30">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo lang={lang} />
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {t.common.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">
              {hasCategories ? t.common.categories : t.common.directions}
            </h4>
            <ul className="space-y-2 text-sm">
              {hasCategories ? (
                activeCategories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${lang}/${c.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {c.namePlural}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted-foreground">
                  {t.common.soonAdded}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">{t.common.site}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${lang}/maqolalar`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.articles}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/qidiruv`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.search}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/biz-haqimizda`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">{t.common.other}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${lang}/qoshish`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.proposeOrg}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/maxfiylik`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/shartlar`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.common.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name}. {t.common.rights}
          </p>
          <p>{t.common.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
