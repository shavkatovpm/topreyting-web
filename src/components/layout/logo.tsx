import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-gold text-white font-bold text-sm shadow-sm"
        aria-hidden
      >
        TR
      </span>
      {withText && (
        <span className="font-bold text-lg tracking-tight">
          Top<span className="text-primary">Reyting</span>
        </span>
      )}
    </Link>
  );
}
