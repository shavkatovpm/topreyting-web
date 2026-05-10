"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoriesDropdown({
  children,
  isEmpty,
  label,
  emptyText,
}: {
  children: ReactNode;
  isEmpty?: boolean;
  label: string;
  emptyText: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1",
          open
            ? "bg-secondary text-foreground"
            : "text-foreground/80 hover:text-foreground hover:bg-secondary"
        )}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="absolute left-0 top-full mt-2 w-[min(560px,calc(100vw-2rem))] rounded-xl border border-border bg-card shadow-lg p-2 z-50"
        >
          {isEmpty ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{emptyText}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
