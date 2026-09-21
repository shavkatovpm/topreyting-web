import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession } from "@/lib/session";

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

/** Cookie -> bazadan admin. Bloklangan/o'chirilgan admin darhol null bo'ladi. */
export const getAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const id = await readSession();
  if (!id) return null;
  const admin = await db.adminUser.findUnique({ where: { id } });
  if (!admin || admin.disabledAt) return null;
  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
});

/** HAR server action va sahifada chaqiriladi — UI'ni yashirish yetarli emas. */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireSuperAdmin(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") redirect("/admin");
  return admin;
}
