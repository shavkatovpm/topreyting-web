import Link from "next/link";
import { db } from "@/lib/db";
import { formatSom } from "@/lib/ranking";
import { PageHeader, StatusBadge, Table, fmtDate, td, th } from "../../_components/ui";

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
            <tr key={b.id}>
              <td className={td}>
                <Link href={`/admin/brands/${b.id}`} className="font-medium text-primary hover:underline">
                  {b.name}
                </Link>
              </td>
              <td className={td}>
                <div className="space-y-1">
                  {b.categories.map((bc) => {
                    const live = bc.activeUntil && bc.activeUntil > now;
                    return (
                      <div key={bc.id} className="text-xs">
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
    </>
  );
}
