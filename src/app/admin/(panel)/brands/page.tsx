import Link from "next/link";
import { Building2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatSom } from "@/lib/ranking";
import { EmptyState, PageHeader, StatusBadge, Table, fmtDate, td, th, trHover } from "../../_components/ui";

export default async function BrandsPage() {
  const brands = await db.brand.findMany({
    where: { status: { not: "DELETED" } },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
  const now = new Date();

  return (
    <>
      <PageHeader
        title="Brendlar"
        action={{ href: "/admin/brands/new", label: "Brend qo'shish" }}
      />
      {brands.length === 0 ? (
        <EmptyState icon={Building2} title="Hali brend yo'q" description="«Brend qo'shish» tugmasi orqali birinchi brendni qo'shing." />
      ) : (
        <Table>
          <thead>
            <tr>
              <th className={th}>Brend</th>
              <th className={th}>Kategoriya / jami / muddat</th>
              <th className={th}>Holat</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className={trHover}>
                <td className={td}>
                  <Link href={`/admin/brands/${b.id}`} className="flex items-center gap-3 font-medium text-primary hover:underline">
                    {b.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.logoUrl} alt="" className="h-8 w-8 shrink-0 rounded-md border border-border bg-white object-contain" />
                    ) : (
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-secondary text-xs font-bold text-muted-foreground">
                        {b.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {b.name}
                  </Link>
                </td>
                <td className={td}>
                  <div className="space-y-1.5">
                    {b.categories.map((bc) => {
                      const live = bc.activeUntil && bc.activeUntil > now;
                      return (
                        <div key={bc.id} className="flex items-center gap-1.5 text-xs">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${live ? "bg-emerald-500" : "bg-red-500"}`} aria-hidden />
                          {bc.category.name} · {formatSom(bc.totalPaid)} ·{" "}
                          <span className={live ? "text-emerald-700" : "text-red-700"}>
                            {bc.activeUntil ? (live ? `${fmtDate(bc.activeUntil)} gacha` : "muddati tugagan") : "to'lov yo'q"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className={td}>
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
