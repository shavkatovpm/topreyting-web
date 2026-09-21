import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

// Foydalanish: npm run admin:create -- <email> <ism> <SUPER_ADMIN|ADMIN> <parol> [telegramId]
// telegramId: Telegram guruhidagi «Tasdiqlash» tugmasi shu adminga ishlashi uchun (ID ni @userinfobot dan bilish mumkin)
async function main() {
  const [email, name, role, password, telegramId] = process.argv.slice(2);
  if (!email || !name || !password || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    console.error("Foydalanish: npm run admin:create -- <email> <ism> <SUPER_ADMIN|ADMIN> <parol> [telegramId]");
    process.exit(1);
  }
  if (telegramId && !/^\d{5,15}$/.test(telegramId)) {
    console.error("telegramId faqat raqamlardan iborat bo'lsin");
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Parol kamida 10 belgi bo'lsin");
    process.exit(1);
  }
  const passwordHash = await hashPassword(password);
  const admin = await db.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { name, role, passwordHash, disabledAt: null, ...(telegramId ? { telegramId } : {}) },
    create: { email: email.toLowerCase(), name, role, passwordHash, telegramId: telegramId ?? null },
  });
  console.log(`Tayyor: ${admin.email} (${admin.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
