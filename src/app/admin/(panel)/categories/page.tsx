import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, StatusBadge, Table, td, th } from "../../_components/ui";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { status: { not: "DELETED" } },
    include: { _count: { select: { brands: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Kategoriyalar"
        description="Har bir kategoriya alohida SEO sahifa (/slug) bo'ladi"
        action={{ href: "/admin/categories/new", label: "Kategoriya qo'shish" }}
      />
      <Table>
        <thead>
          <tr>
            <th className={th}>Nomi</th>
            <th className={th}>URL</th>
            <th className={th}>Brendlar</th>
            <th className={th}>Holat</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className={td}>
                <Link href={`/admin/categories/${c.id}`} className="font-medium text-primary hover:underline">
                  {c.name}
                </Link>
              </td>
              <td className={`${td} text-muted-foreground`}>/{c.slug}</td>
              <td className={td}>{c._count.brands}</td>
              <td className={td}>
                <StatusBadge status={c.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
