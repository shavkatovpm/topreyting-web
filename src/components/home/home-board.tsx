"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { BoardBrand, BoardData } from "@/lib/public-data";
import { getCategoryVisual } from "@/data/categories";
import { localeHref, type Dictionary, type Locale } from "@/i18n";
import { OPEN_JOIN_EVENT } from "@/components/join/join-button";
import {
  AlertIcon,
  CheckIcon,
  ChevronIcon,
  CupIcon,
  CrownIcon,
  GlobeIcon,
  GridIcon,
  InstagramIcon,
  PlusIcon,
  SearchIcon,
  ArrowIcon,
  TelegramIcon,
} from "./icons";

type T = Dictionary["nv"];
type Ctx = {
  data: BoardData;
  lang: Locale;
  t: T;
  category: string; // "all" yoki kategoriya slug'i
  setCategory: (c: string) => void;
  query: string;
  setQuery: (q: string) => void;
  minText: string;
  months: number;
  notice: string;
};

const BoardCtx = createContext<Ctx | null>(null);
const useBoard = () => {
  const c = useContext(BoardCtx);
  if (!c) throw new Error("BoardProvider yo'q");
  return c;
};

const money = (n: number) => String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

// Pullik havolalar: Google talabi bo'yicha rel="sponsored"
const OUT_REL = "sponsored nofollow noopener noreferrer";

export function BoardProvider({
  data,
  lang,
  t,
  minText,
  months,
  notice,
  children,
}: {
  data: BoardData;
  lang: Locale;
  t: T;
  minText: string;
  months: number;
  notice: string;
  children: React.ReactNode;
}) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const value = useMemo(
    () => ({ data, lang, t, category, setCategory, query, setQuery, minText, months, notice }),
    [data, lang, t, category, query, minText, months, notice]
  );
  return <BoardCtx.Provider value={value}>{children}</BoardCtx.Provider>;
}

/**
 * Sticky panel: kategoriya dropdown'i + qidiruv. Dropdown ichidagi elementlar haqiqiy havolalar
 * (SEO: kategoriya sahifalariga ichki linklar), lekin bosilganda joyida filtrlaydi.
 */
export function CategoryBar() {
  const { data, lang, t, category, setCategory, query, setQuery } = useBoard();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tashqariga bosilganda / Esc bosilganda yopiladi
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Ochilganda tanlangan elementga fokus (klaviatura bilan qulay)
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("[aria-current=true]")?.focus();
  }, [open]);

  const pick = (e: React.MouseEvent, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // yangi tabda ochish
    e.preventDefault();
    setCategory(slug);
    setOpen(false);
    // Sahifa pastroqda bo'lsa, jadval boshiga qaytadi (sticky panel ostida)
    const board = document.getElementById("reyting");
    if (board && board.getBoundingClientRect().top < 0) board.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(".catdrop-item") ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
  };

  const current =
    category === "all"
      ? { name: t.all, count: data.all.length, icon: <GridIcon /> }
      : (() => {
          const c = data.categories.find((x) => x.slug === category);
          const Icon = getCategoryVisual(category).icon;
          return { name: c?.name ?? t.all, count: c?.count ?? 0, icon: <Icon strokeWidth={1.65} aria-hidden /> };
        })();

  const options = [
    { slug: "all", name: t.all, count: data.all.length, href: localeHref(lang), icon: <GridIcon /> },
    ...data.categories.map((c) => {
      const Icon = getCategoryVisual(c.slug).icon;
      return {
        slug: c.slug,
        name: c.name,
        count: c.count,
        href: localeHref(lang, `/${c.slug}`),
        icon: <Icon strokeWidth={1.65} aria-hidden />,
      };
    }),
  ];

  return (
    <div className="header cat-bar">
      <div className="wrap catbar-inner">
        <div className="catdrop" ref={rootRef}>
          <button
            ref={btnRef}
            type="button"
            className={`catdrop-btn ${open ? "open" : ""}`}
            aria-expanded={open}
            aria-controls="catdrop-panel"
            onClick={() => setOpen((v) => !v)}
          >
            {current.icon}
            <span className="catdrop-label">{current.name}</span>
            <span className="count">{current.count}</span>
            <span className="catdrop-chevron">
              <ChevronIcon />
            </span>
          </button>

          {/* Panel DOM'da doim bor (yopiq holatda yashirin): kategoriya havolalari HTML'da qoladi */}
          <div id="catdrop-panel" className="catdrop-panel" hidden={!open} ref={panelRef} onKeyDown={onPanelKey}>
            <nav aria-label={t.categories}>
              <p className="catdrop-title">{t.categories}</p>
              {options.map((o) => (
                <Link
                  key={o.slug}
                  href={o.href}
                  className={`catdrop-item ${category === o.slug ? "selected" : ""}`}
                  aria-current={category === o.slug ? "true" : undefined}
                  onClick={(e) => pick(e, o.slug)}
                >
                  <span className="catdrop-icon">{o.icon}</span>
                  <span className="catdrop-name">{o.name}</span>
                  <span className="count">{o.count}</span>
                  <span className="catdrop-check">{category === o.slug && <CheckIcon />}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <label className="search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchAria}
          />
        </label>
      </div>
    </div>
  );
}
function Socials({ b }: { b: BoardBrand }) {
  const items = [
    { url: b.links.site, label: "Sayt", icon: <GlobeIcon /> },
    { url: b.links.telegram, label: "Telegram", icon: <TelegramIcon /> },
    { url: b.links.instagram, label: "Instagram", icon: <InstagramIcon /> },
  ].filter((i): i is { url: string; label: string; icon: React.JSX.Element } => !!i.url);
  return (
    <div className="socials">
      {items.map((i) => (
        <a key={i.label} href={i.url} target="_blank" rel={OUT_REL} aria-label={`${b.name} — ${i.label}`}>
          {i.icon}
        </a>
      ))}
    </div>
  );
}

function Row({ b }: { b: BoardBrand }) {
  const { lang, t, category } = useBoard();
  const premium = b.rank <= 3;
  const zone = b.tier === "red" ? "red" : b.rank <= 10 ? "top" : "normal";
  const showDeadline = zone === "red" || b.daysLeft <= 14;
  const cls = [
    "brand-row",
    premium ? `premium-row rank-${b.rank}` : "",
    zone === "red" ? "danger" : zone === "top" ? "topten" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const boost = () =>
    window.dispatchEvent(
      new CustomEvent(OPEN_JOIN_EVENT, {
        detail: {
          boost: {
            brandId: b.id,
            name: b.name,
            categories: b.categories,
            categorySlug: category !== "all" ? category : b.categorySlug,
          },
        },
      })
    );

  return (
    <article className={cls}>
      <div className="row-rank" aria-label={`${b.rank}${t.rankAria}`}>
        {b.rank === 1 && <CrownIcon />}
        <span>{b.rank}</span>
        {premium && (
          <span className="premium-badge">
            {b.rank === 1 ? t.leader : b.rank === 2 ? t.runnerUp : t.thirdPlace}
          </span>
        )}
      </div>
      <div className="brandline">
        <div
          className="logo"
          style={{ background: `hsl(${b.hue} 30% 88%)`, color: `hsl(${b.hue} 38% 32%)` }}
        >
          {b.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.logoUrl} alt="" loading="lazy" />
          ) : (
            b.initial
          )}
        </div>
        <div className="brand-text">
          <div className="brand-name">
            <h3>
              <Link href={localeHref(lang, `/${b.categorySlug}/${b.slug}`)}>{b.name}</Link>
            </h3>
          </div>
          <p className={showDeadline ? "deadline" : ""}>
            {showDeadline ? `◷ ${t.removeIn} ${b.daysLeft} ${t.removeDays}` : b.categoryName}
          </p>
          <div className="row-description">{b.description}</div>
        </div>
      </div>
      <Socials b={b} />
      <div className="row-amount">
        {money(b.total)}
        <small>{t.som}</small>
        {premium && <span className="contribution-label">{t.contribution}</span>}
      </div>
      <button type="button" className="boost" onClick={boost} aria-label={`${b.name} ${t.boostAria}`}>
        <PlusIcon />
        <span>{t.boost}</span>
      </button>
    </article>
  );
}

export function Board() {
  const { data, t, category, query, minText, months, notice } = useBoard();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const list = category === "all" ? data.all : (data.byCategory[category] ?? []);
  const q = query.trim().toLowerCase();
  const filtered = q ? list.filter((b) => b.search.includes(q)) : list;
  const title = category === "all" ? t.allBrands : (data.categories.find((c) => c.slug === category)?.name ?? t.allBrands);

  let section = "";
  const rows = filtered.flatMap((b) => {
    const zone = b.tier === "red" ? "red" : b.rank <= 10 ? "top" : "normal";
    const out: React.ReactNode[] = [];
    if (zone !== section) {
      section = zone;
      if (zone === "red")
        out.push(
          <div key={`h-${b.id}`} className="tier-heading danger-head">
            <AlertIcon /> {t.headRed}
          </div>
        );
      else if (zone === "normal")
        out.push(
          <div key={`h-${b.id}`} className="tier-heading">
            {t.headAll}
          </div>
        );
    }
    out.push(<Row key={b.id} b={b} />);
    return out;
  });

  return (
    <section className="board" id="reyting" aria-label={t.navRanking}>
      <div className="board-top">
        <div className="board-title">
          <h2>
            {title} <span>{filtered.length}</span>
          </h2>
        </div>
        <div className="board-tools">
          <span className="sorting">
            <ArrowIcon /> {t.sortedBy}
          </span>
        </div>
      </div>

      <div className="list">
        <div className="list-head">
          <span>{t.colRank}</span>
          <span>{t.colBrand}</span>
          <span className="social-title">{t.colLinks}</span>
          <span>{t.colTotal}</span>
          <span />
        </div>
        {rows}
        {data.all.length === 0 && <div className="empty">{t.emptyBoard}</div>}
        {data.all.length > 0 && filtered.length === 0 && <div className="empty">{t.notFound}</div>}
      </div>

      <div className="board-note">
        {/* Pullik reyting ekani haqidagi majburiy izoh */}
        <span>{notice}</span>
        <button type="button" onClick={() => dialogRef.current?.showModal()}>
          {t.rulesLink}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="nv-dialog"
        aria-labelledby="rules-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="modal-head">
          <h2 id="rules-title">{t.rulesTitle}</h2>
          <button type="button" className="close" aria-label={t.close} onClick={() => dialogRef.current?.close()}>
            ×
          </button>
        </div>
        <div className="modal-copy">
          {t.rules.map((p) => (
            <p key={p}>{fill(p, { min: minText, months })}</p>
          ))}
        </div>
      </dialog>
    </section>
  );
}
