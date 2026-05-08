import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, Send, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aloqa — Top Reyting jamoasi bilan bog'lanish",
  description:
    "Top Reyting jamoasi bilan bog'lanish: hamkorlik, savol-javoblar, ma'lumot yuborish.",
  alternates: { canonical: "/aloqa" },
};

export default function ContactPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page pt-6 text-sm">
        <ol className="flex items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Bosh sahifa
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-foreground font-medium">Aloqa</li>
        </ol>
      </nav>

      <section className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Aloqa</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Bizga murojaat qilishning eng tez yo&apos;li — Telegram. Yoki email orqali
            yozing.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <a
              href={site.social.telegram}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors group"
            >
              <Send size={24} className="text-primary mb-3" />
              <h2 className="font-semibold text-lg mb-1">Telegram</h2>
              <p className="text-sm text-muted-foreground mb-3">Eng tez javob</p>
              <p className="text-sm font-medium text-primary group-hover:underline">
                @topreyting →
              </p>
            </a>

            <a
              href={`mailto:${site.email}`}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors group"
            >
              <Mail size={24} className="text-primary mb-3" />
              <h2 className="font-semibold text-lg mb-1">Email</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Hamkorlik va rasmiy murojaatlar
              </p>
              <p className="text-sm font-medium text-primary group-hover:underline break-all">
                {site.email}
              </p>
            </a>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/30 p-6">
            <MessageCircle size={20} className="text-primary mb-2" />
            <h2 className="font-semibold mb-2">Tezkor savollar</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                — E&apos;lon qo&apos;shmoqchimisiz?{" "}
                <Link href="/qoshish" className="text-primary hover:underline">
                  Bu yerga
                </Link>
              </li>
              <li>
                — Reklama imkoniyatlari?{" "}
                <Link href="/reklama" className="text-primary hover:underline">
                  Bu yerga
                </Link>
              </li>
              <li>
                — Ma&apos;lumot noto&apos;g&apos;rimi?{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-primary hover:underline"
                >
                  Bizga yozing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", url: "/" },
          { name: "Aloqa", url: "/aloqa" },
        ])}
      />
    </>
  );
}
