import Link from "next/link";
import { ArrowLeft, CheckCircle2, TriangleAlert } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// text-base (16px) mobilda: kichikroq shrift iOS Safari'da fokusda avtomatik zoom qildiradi.
// Kompyuterda md:text-sm bilan odatdagi o'lchamga qaytadi.
export const inputCls =
  "h-11 w-full rounded-md border border-border bg-background px-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring md:h-10 md:text-sm";
export const textareaCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none transition-shadow focus:ring-2 focus:ring-ring md:text-sm";

export function Field({
  label,
  hint,
  children,
  group,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  /** Bir nechta input o'raladigan maydon (checkbox'lar): <label> emas, <div> */
  group?: boolean;
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">{hint}</span>}
    </Wrapper>
  );
}

/** Ro'yxatga qaytish havolasi — batafsil/tahrirlash sahifalari tepasida */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className={cn(buttonVariants({ variant: "default" }), "shrink-0")}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Notice({
  kind = "success",
  children,
}: {
  kind?: "success" | "error";
  children: React.ReactNode;
}) {
  const Icon = kind === "success" ? CheckCircle2 : TriangleAlert;
  const cls =
    kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <p className={cn("mb-5 flex items-start gap-2 rounded-lg border px-3.5 py-2.5 text-sm", cls)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>{children}</div>
  );
}

/** Ro'yxat bo'sh bo'lganda — quruq matn o'rniga */
export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

const statusVariant: Record<string, "success" | "outline" | "default"> = {
  ACTIVE: "success",
  CONFIRMED: "success",
  UNPUBLISHED: "outline",
  DELETED: "outline",
  VOIDED: "outline",
};
const statusExtra: Record<string, string> = {
  UNPUBLISHED: "border-amber-200 bg-amber-50 text-amber-700",
  DELETED: "border-red-200 bg-red-50 text-red-700",
  VOIDED: "border-red-200 bg-red-50 text-red-700",
};
const statusLabel: Record<string, string> = {
  ACTIVE: "Nashr qilingan",
  UNPUBLISHED: "Yashirin",
  DELETED: "O'chirilgan",
  CONFIRMED: "Tasdiqlangan",
  VOIDED: "Bekor qilingan",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(badgeVariants({ variant: statusVariant[status] ?? "default" }), statusExtra[status])}>
      {statusLabel[status] ?? status}
    </span>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
export const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-secondary/60 first:rounded-tl-xl last:rounded-tr-xl";
export const td = "px-4 py-3 border-t border-border align-middle";
/** `<tr>`ga qo'shiladi: jadval qatorlariga bosilganda yengil urg'u beradi */
export const trHover = "transition-colors hover:bg-secondary/40";

/** Kichik ikkilamchi/xavfli tugma (jadval/sarlavha ichida) — Link yoki <button> uchun */
export const btnOutline = cn(buttonVariants({ variant: "outline", size: "sm" }));
export const btnDanger = cn(buttonVariants({ variant: "destructive", size: "sm" }));

/** Sana: 2026-01-10 -> "10.01.2026" */
export function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}
