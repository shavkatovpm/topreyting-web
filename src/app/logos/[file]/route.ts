import { readLogo } from "@/lib/storage";

export const runtime = "nodejs";

// Chek fayllaridan farqli o'laroq (/admin/receipts) logolar PUBLIC: brend kartochkalarida ko'rinadi.
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const buf = await readLogo(file);
  if (!buf) return new Response("Not found", { status: 404 });
  const ext = file.split(".").pop() ?? "";

  return new Response(new Uint8Array(buf), {
    headers: {
      "content-type": MIME[ext] ?? "application/octet-stream",
      // Fayl nomi tasodifiy (UUID) — almashtirilganda yangi nom oladi, shuning uchun abadiy keshlash xavfsiz.
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
    },
  });
}
