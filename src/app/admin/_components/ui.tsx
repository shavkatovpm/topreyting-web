import Link from "next/link";

export const inputCls =
  "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
export const textareaCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

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
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </Wrapper>
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
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
        >
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
  const cls =
    kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";
  return <p className={`mb-4 rounded-md border px-3 py-2 text-sm ${cls}`}>{children}</p>;
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>{children}</div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UNPUBLISHED: "bg-amber-50 text-amber-700 border-amber-200",
    DELETED: "bg-red-50 text-red-700 border-red-200",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    VOIDED: "bg-red-50 text-red-700 border-red-200",
  };
  const label: Record<string, string> = {
    ACTIVE: "Nashr qilingan",
    UNPUBLISHED: "Yashirin",
    DELETED: "O'chirilgan",
    CONFIRMED: "Tasdiqlangan",
    VOIDED: "Bekor qilingan",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${map[status] ?? ""}`}
    >
      {label[status] ?? status}
    </span>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
export const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";
export const td = "px-4 py-3 border-t border-border align-middle";

/** Sana: 2026-01-10 -> "10.01.2026" */
export function fmtDate(d: Date | null | undefined) {
  if (!d) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}
