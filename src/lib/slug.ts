/** "Najot Ta'lim" -> "najot-talim". O'zbek apostrof belgilari olib tashlanadi. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ʻʼ'`’‘]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * `/{category}` yo'li mavjud sahifalar va til prefikslari bilan to'qnashmasligi kerak.
 * (Brend slug'i `/{category}/{brand}` ichida, unga bu cheklov kerak emas.)
 */
export const RESERVED_CATEGORY_SLUGS = new Set([
  "admin",
  "api",
  "uz",
  "ru",
  "maqolalar",
  "biz-haqimizda",
  "qoshish",
  "qidiruv",
  "reklama",
  "maxfiylik",
  "shartlar",
  "sitemap",
  "robots",
  "llms",
  "out",
]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
