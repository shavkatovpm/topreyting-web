"use client";

import { cn } from "@/lib/utils";

export const OPEN_JOIN_EVENT = "open-join-modal";

/** Sahifadagi istalgan joydan modalni ochadi (modal layout'da bir marta render qilinadi). */
export function JoinButton({
  children,
  className,
  categorySlug,
}: {
  children: React.ReactNode;
  className?: string;
  /** Kategoriyani oldindan tanlab qo'yish */
  categorySlug?: string;
}) {
  return (
    <button
      type="button"
      data-join-trigger
      onClick={() =>
        window.dispatchEvent(new CustomEvent(OPEN_JOIN_EVENT, { detail: { categorySlug } }))
      }
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90",
        className
      )}
    >
      {children}
    </button>
  );
}
