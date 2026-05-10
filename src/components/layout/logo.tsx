import Image from "next/image";
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
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        priority
        sizes="36px"
        className="rounded-[10px] shrink-0"
      />
      {withText && (
        <span className="font-bold text-lg tracking-tight leading-tight">
          top<span className="text-primary">reyting</span>
        </span>
      )}
    </Link>
  );
}
