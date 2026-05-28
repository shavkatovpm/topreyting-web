export type Listing = {
  slug: string;
  name: string;
  category: string;
  city: string;
  shortDescription: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  yearFounded?: number;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  workingHours?: string;
  services: string[];
  features: string[];
  faqs: { q: string; a: string }[];
  featured: boolean;
  verified: boolean;
  rank?: number;
};

export const listings: Listing[] = [
  {
    slug: "001-barbershop",
    name: "001 Barbershop",
    category: "go-zallik",
    city: "toshkent",
    shortDescription:
      "Toshkentdagi 001 Barbershop — qulay muhit va hamyonbop narxlarda erkaklar uchun soch olish. Turli daraja masterlar, har kuni kechqurun 23:00 gacha ochiq, Telegram orqali onlayn bron.",
    description:
      "001 Barbershop — Toshkent shahridagi erkaklar uchun sartaroshxona. Asosiy ustunligi — qulay, dam oladigan muhit va hamyonbop narxlar: har bir mijoz o'z byudjetiga mos master tanlashi mumkin.\n\nSalonda turli daraja masterlar ishlaydi. Boshlang'ich daraja masterlarda soch olish 100 000–120 000 so'm, tajribali (top) masterlarda esa 200 000–300 000 so'm atrofida. Shu tariqa ham endigina boshlaganlar, ham eng yaxshi natijani istaganlar uchun tanlov bor.\n\n001 Barbershop har kuni ertalab 10:00 dan kechqurun 23:00 gacha ishlaydi — ish kunidan keyin ham bemalol kelib soch olish mumkin. Salon Toshkent shahridagi Qurilish ko'chasida joylashgan. Navbatga yozilish va bron qilish Telegram (@001_barbershop_) yoki telefon (+998 77 001 40 40) orqali amalga oshiriladi.",
    rating: 0,
    reviewCount: 0,
    priceRange: "100 000 – 300 000 so'm",
    address: "Qurilish ko'chasi, Toshkent",
    phone: "+998 77 001 40 40",
    website: "https://t.me/001_barbershop_",
    workingHours: "Har kuni 10:00 – 23:00",
    services: [
      "Erkaklar soch olish — boshlang'ich master (100 000–120 000 so'm)",
      "Erkaklar soch olish — top master (200 000–300 000 so'm)",
      "Soqol olish va shakllantirish",
      "Soch + soqol (kompleks xizmat)",
      "Telegram orqali onlayn bron",
    ],
    features: [
      "Qulay, dam oladigan muhit",
      "Hamyonbop narxlar",
      "Turli daraja masterlar",
      "Kechqurun 23:00 gacha ochiq",
      "Onlayn bron (Telegram)",
    ],
    faqs: [
      {
        q: "001 Barbershop qayerda joylashgan?",
        a: "001 Barbershop Toshkent shahridagi Qurilish ko'chasida joylashgan. Bog'lanish uchun telefon: +998 77 001 40 40.",
      },
      {
        q: "001 Barbershopda soch olish narxi qancha?",
        a: "Soch olish narxi master darajasiga bog'liq: boshlang'ich daraja masterlarda 100 000–120 000 so'm, tajribali (top) masterlarda 200 000–300 000 so'm.",
      },
      {
        q: "001 Barbershop necha soatgacha ishlaydi?",
        a: "Salon har kuni ertalab 10:00 dan kechqurun 23:00 gacha ishlaydi.",
      },
      {
        q: "001 Barbershopga qanday qilib bron qilish mumkin?",
        a: "Navbatga yozilish Telegram orqali @001_barbershop_ akkauntida yoki +998 77 001 40 40 raqamiga qo'ng'iroq qilish orqali amalga oshiriladi.",
      },
      {
        q: "Toshkentda kechqurun kech ochiq barbershop bormi?",
        a: "Ha, 001 Barbershop har kuni 23:00 gacha ishlaydi — ish kunidan keyin yoki kech soatlarda ham kelib soch oldirish mumkin.",
      },
    ],
    featured: true,
    verified: false,
  },
];

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function getCategorySlugsWithListings(): string[] {
  return Array.from(new Set(listings.map((l) => l.category)));
}

export function getListingsByCategory(categorySlug: string): Listing[] {
  return listings
    .filter((l) => l.category === categorySlug)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
}

export function getFeaturedListings(): Listing[] {
  return listings.filter((l) => l.featured);
}

export function getTopListings(limit: number = 6): Listing[] {
  return [...listings]
    .sort(
      (a, b) =>
        b.rating * Math.log10(b.reviewCount + 1) -
        a.rating * Math.log10(a.reviewCount + 1)
    )
    .slice(0, limit);
}
