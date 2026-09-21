import type { Viewport } from "next";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { JoinModalHost } from "@/components/join/join-modal-host";
import { NavyFooter, NavyHeader } from "@/components/home/navy-chrome";
import { isLocale } from "@/i18n/config";
import "./navy.css";
import "./navy-extra.css";

// Dizayndagi sarlavha shrifti (Inter — umumiy root layout'dan --font-sans sifatida keladi)
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#142339" };

/** Bosh sahifa: Navy dizayn. Ichki sahifalar (site) umumiy sayt dizaynida qoladi. */
export default async function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className={`nv ${manrope.variable}`}>
      <NavyHeader lang={lang} />
      {children}
      <NavyFooter lang={lang} />
      <JoinModalHost lang={lang} />
    </div>
  );
}
