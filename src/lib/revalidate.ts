import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Public sahifalar (bosh sahifa, kategoriya, brend, sitemap) keshini yangilaydi.
 * Admin har qanday o'zgartirish (to'lov, brend, kategoriya, sozlama) kiritganda chaqiriladi.
 */
export function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}
