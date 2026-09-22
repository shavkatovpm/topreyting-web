import { BackLink, PageHeader } from "../../../_components/ui";
import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <>
      <BackLink href="/admin/categories" label="Barcha kategoriyalar" />
      <PageHeader title="Yangi kategoriya" />
      <CategoryForm />
    </>
  );
}
