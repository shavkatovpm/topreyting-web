import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { defaultLocale, type Locale } from "@/i18n/config";

export function Logo({
  className,
  withText = true,
  lang = defaultLocale,
}: {
  className?: string;
  withText?: boolean;
  lang?: Locale;
}) {
  return (
    <Link
      href={`/${lang}`}
      aria-label={withText ? undefined : site.name}
      className={cn("inline-flex items-end gap-2.5", className)}
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
