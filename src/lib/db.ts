import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

// Lokal: SQLite. Droplet'da: @prisma/adapter-pg + Postgres (faqat shu fayl va provider o'zgaradi).
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL o'rnatilmagan (.env ni tekshiring)");
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalForDb = globalThis as unknown as { db?: PrismaClient };

// Dev'da hot-reload har safar yangi ulanish ochmasligi uchun global'da saqlaymiz
export const db = globalForDb.db ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
