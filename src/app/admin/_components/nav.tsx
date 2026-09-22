"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// `icon` — Server Component'da tayyorlangan JSX element (RSC chegarasidan komponent
// funksiyasini emas, faqat render qilingan elementni o'tkazish mumkin).
export type NavItem = { href: string; label: string; icon: React.ReactNode; badge?: number };

export function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="relative">
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map(({ href, label, icon, badge }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/75 hover:bg-secondary hover:text-foreground"
              )}
            >
              {icon}
              {label}
              {!!badge && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Mobilda: barcha bo'limlar bitta qatorga sig'maydi, gorizontal skroll kerak.
          O'ng chetdagi soya "yana bo'limlar bor" degan ishorani beradi. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent md:hidden" />
    </div>
  );
}
