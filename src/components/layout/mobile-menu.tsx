"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function MobileMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

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
        aria-label="Yopish"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
      />
      <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <span className="font-bold text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Menyu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Yopish"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <nav
          aria-label="Mobil navigatsiya"
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
        aria-label="Menyuni ochish"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
      >
        <Menu size={18} />
      </button>

      {open && mounted && createPortal(overlay, document.body)}
    </>
  );
}
