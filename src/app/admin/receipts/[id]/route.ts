import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { readReceipt } from "@/lib/storage";

export const runtime = "nodejs";

/** Chek faylini FAQAT kirgan adminlarga beradi. Public papkada saqlanmaydi. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const sub = await db.submission.findUnique({ where: { id } });
  if (!sub) return new Response("Not found", { status: 404 });
  const file = await readReceipt(sub.receiptFile);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "content-type": sub.receiptMime,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      // Foydalanuvchi yuklagan fayl: hech qanday skript ishlamasin
      "content-security-policy": "sandbox; default-src 'none'; img-src 'self' data:; object-src 'self'",
      "content-disposition": "inline",
    },
  });
}
