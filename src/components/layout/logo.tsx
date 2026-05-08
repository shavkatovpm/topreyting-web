import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={withText ? undefined : site.name}
      className={cn("inline-flex items-end gap-2.5", className)}
    >
      <span className="flex items-end gap-0.5 h-9 shrink-0" aria-hidden>
        <span className="w-2 h-3 rounded-sm bg-primary/40" />
        <span className="w-2 h-5 rounded-sm bg-primary/70" />
        <span className="w-2 h-7 rounded-sm bg-primary" />
      </span>
      {withText && (
        <span className="font-bold text-lg tracking-tight leading-tight pb-0.5">
          top<span className="text-primary">reyting</span>
        </span>
      )}
    </Link>
  );
}
