import { db } from "@/lib/db";
import { BackLink, PageHeader } from "../../../_components/ui";
import { BrandForm } from "../brand-form";

export default async function NewBrandPage() {
  const categories = await db.category.findMany({
    where: { status: { not: "DELETED" } },
    select: { id: true, name: true, status: true },
    orderBy: { name: "asc" },
  });
  return (
    <>
      <BackLink href="/admin/brands" label="Barcha brendlar" />
      <PageHeader
        title="Yangi brend"
        description="Avval brendni qo'shing, so'ng to'lovni kiriting — shundan keyin u reytingda paydo bo'ladi"
      />
      <BrandForm categories={categories} />
    </>
  );
}
