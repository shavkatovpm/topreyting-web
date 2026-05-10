"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ANIM_MS = 280;

export function MobileMenu({
  children,
  menuLabel = "Menyu",
  closeLabel = "Yopish",
}: {
  children: ReactNode;
  menuLabel?: string;
  closeLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Drive enter/exit animation
  useEffect(() => {
    if (open) {
      setRendered(true);
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => setShow(true));
        return () => cancelAnimationFrame(r2);
      });
      return () => cancelAnimationFrame(r1);
    }
    setShow(false);
    const t = setTimeout(() => setRendered(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [open]);

  // Lock scroll while rendered
  useEffect(() => {
    if (rendered) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [rendered]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const overlay = (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label={closeLabel}
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
          show ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-background shadow-2xl flex flex-col will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          show ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <span className="font-bold text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {menuLabel}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <nav
          aria-label={menuLabel}
          className="flex-1 overflow-y-auto p-4"
        >
          {children}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
      >
        <Menu size={18} />
      </button>

      {rendered && mounted && createPortal(overlay, document.body)}
    </>
  );
}
