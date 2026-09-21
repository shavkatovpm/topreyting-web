import Link from "next/link";
import { JoinButton } from "@/components/join/join-button";
import { LanguageToggle } from "@/components/language-toggle";
import { getPublicCategories } from "@/lib/public-data";
import { getDictionary, localeHref, type Locale } from "@/i18n";
import { PlusIcon } from "./icons";

function Wordmark({ lang }: { lang: Locale }) {
  return (
    <Link className="wordmark" href={localeHref(lang)} aria-label="Topreyting">
      <span className="mark" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      topreyting<em>.</em>
    </Link>
  );
}

/** Navy bosh sahifa header'i (dizayn: wordmark, havolalar, til, «Brend qo'shish»). */
export function NavyHeader({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).nv;
  return (
    <header className="header">
      <div className="wrap nav">
        <Wordmark lang={lang} />
        <nav className="navlinks" aria-label={t.navMenu}>
          <a className="active" href="#reyting">{t.navRanking}</a>
          <a href="#qanday">{t.navHow}</a>
          <Link href={localeHref(lang, "/maqolalar")}>{t.navArticles}</Link>
        </nav>
        <div className="navright">
          <span className="language">
            <LanguageToggle currentLang={lang} />
          </span>
          <JoinButton unstyled className="btn primary">
            <PlusIcon />
            {t.addBrand}
          </JoinButton>
        </div>
      </div>
    </header>
  );
}

export async function NavyFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).nv;
  const categories = await getPublicCategories();
  return (
    <footer>
      <div className="wrap">
        <Wordmark lang={lang} />
        <p>
          © {new Date().getFullYear()} {t.copyright}
        </p>
        <div className="footer-links">
          <Link href={localeHref(lang, "/maqolalar")}>{t.navArticles}</Link>
          <Link href={localeHref(lang, "/shartlar")}>{t.footerRules}</Link>
          <Link href={localeHref(lang, "/maxfiylik")}>{t.footerPrivacy}</Link>
          <Link href={localeHref(lang, "/biz-haqimizda")}>{t.footerAbout}</Link>
          {/* Telefonda header'dagi til tugmasi yashirilgan: shu yerdan almashtiriladi */}
          <span className="footer-lang">
            <LanguageToggle currentLang={lang} />
          </span>
        </div>
        {categories.length > 0 && (
          <nav className="footer-cats" aria-label={t.categories}>
            {categories.map((c) => (
              <Link key={c.slug} href={localeHref(lang, `/${c.slug}`)}>
                {c.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
