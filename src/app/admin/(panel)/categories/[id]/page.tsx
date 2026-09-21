import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Notice, PageHeader, StatusBadge } from "../../../_components/ui";
import { setCategoryStatus } from "../../../actions/category";
import { CategoryForm } from "../category-form";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const category = await db.category.findUnique({ where: { id } });
  if (!category || category.status === "DELETED") notFound();

  const btn = "h-9 rounded-md border border-border bg-background px-3 text-sm hover:bg-secondary";

  return (
    <>
      <PageHeader title={category.name} />
      {saved && <Notice>Saqlandi</Notice>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={category.status} />
        {category.status === "ACTIVE" ? (
          <form action={setCategoryStatus.bind(null, id, "UNPUBLISHED")}>
            <button className={btn}>Yashirish</button>
          </form>
        ) : (
          <form action={setCategoryStatus.bind(null, id, "ACTIVE")}>
            <button className={btn}>Nashr qilish</button>
          </form>
        )}
        {admin.role === "SUPER_ADMIN" && (
          <form action={setCategoryStatus.bind(null, id, "DELETED")}>
            <button className={`${btn} text-red-700`}>O&apos;chirish</button>
          </form>
        )}
      </div>

      <CategoryForm category={category} />
    </>
  );
}
