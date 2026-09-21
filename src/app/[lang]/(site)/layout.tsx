import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JoinModalHost } from "@/components/join/join-modal-host";
import { isLocale } from "@/i18n/config";

/** Ichki sahifalar (maqolalar, kategoriya, brend, ...): umumiy sayt header/footer'i. */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
      <JoinModalHost lang={lang} />
    </>
  );
}
