import {
  Stethoscope,
  Megaphone,
  Briefcase,
  GraduationCap,
  Rocket,
  Building2,
  Wrench,
  Scale,
  Sparkles,
  Code,
  type LucideIcon,
} from "lucide-react";
import { getCategorySlugsWithListings } from "./listings";

export type Category = {
  slug: string;
  name: string;
  namePlural: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  color: string;
};

export const categories: Category[] = [
  {
    slug: "klinikalar",
    name: "Klinika",
    namePlural: "Klinikalar",
    description:
      "O'zbekistondagi tibbiy klinikalar, shifoxonalar va davolash markazlari haqida.",
    metaTitle: "Klinikalar — O'zbekiston tibbiy markazlari | Top Reyting",
    metaDescription:
      "O'zbekistondagi klinikalar va shifoxonalar haqida ma'lumot, qo'llanmalar va tahlillar.",
    icon: Stethoscope,
    color: "from-rose-500 to-pink-500",
  },
  {
    slug: "agentliklar",
    name: "Agentlik",
    namePlural: "Agentliklar",
    description:
      "Marketing, reklama, SMM va boshqa sohalardagi agentliklar haqida.",
    metaTitle: "Agentliklar — Marketing va reklama | Top Reyting",
    metaDescription:
      "Marketing, reklama, SMM agentliklari haqida qo'llanmalar va tahlillar.",
    icon: Megaphone,
    color: "from-orange-500 to-amber-500",
  },
  {
    slug: "bizneslar",
    name: "Biznes",
    namePlural: "Bizneslar",
    description:
      "Kichik va o'rta bizneslar, do'konlar, restoranlar va xizmatlar haqida.",
    metaTitle: "Bizneslar | Top Reyting",
    metaDescription:
      "O'zbekiston bizneslari haqida qo'llanma va tahlillar.",
    icon: Building2,
    color: "from-blue-500 to-indigo-500",
  },
  {
    slug: "mutaxassislar",
    name: "Mutaxassis",
    namePlural: "Mutaxassislar",
    description:
      "Tajribali shifokorlar, advokatlar, dizaynerlar va boshqa mutaxassislar haqida.",
    metaTitle: "Mutaxassislar | Top Reyting",
    metaDescription:
      "Sohaning yetakchi mutaxassislari haqida ma'lumot va tahlillar.",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "startaplar",
    name: "Startap",
    namePlural: "Startaplar",
    description:
      "O'zbekistondagi innovatsion startaplar va texnologik kompaniyalar haqida.",
    metaTitle: "Startaplar | Top Reyting",
    metaDescription:
      "O'zbekiston startaplari haqida tahlillar va materiallar.",
    icon: Rocket,
    color: "from-violet-500 to-purple-500",
  },
  {
    slug: "it-kompaniyalar",
    name: "IT kompaniya",
    namePlural: "IT kompaniyalar",
    description:
      "Dasturiy ta'minot ishlab chiqaruvchi kompaniyalar va veb-studiyalar haqida.",
    metaTitle: "IT kompaniyalar | Top Reyting",
    metaDescription:
      "O'zbekiston IT kompaniyalari haqida qo'llanmalar va tahlillar.",
    icon: Code,
    color: "from-cyan-500 to-sky-500",
  },
  {
    slug: "yuristlar",
    name: "Yurist",
    namePlural: "Yuristlar",
    description: "Advokatlar, yuridik byurolar va konsultantlar haqida.",
    metaTitle: "Yuristlar va advokatlar | Top Reyting",
    metaDescription: "Yuristlar va advokatlar haqida qo'llanmalar.",
    icon: Scale,
    color: "from-slate-600 to-zinc-600",
  },
  {
    slug: "qurilish",
    name: "Qurilish",
    namePlural: "Qurilish kompaniyalari",
    description: "Qurilish, ta'mirlash va dizayn kompaniyalari haqida.",
    metaTitle: "Qurilish kompaniyalari | Top Reyting",
    metaDescription: "Qurilish va dizayn sohasidagi qo'llanmalar.",
    icon: Wrench,
    color: "from-yellow-500 to-orange-500",
  },
  {
    slug: "go-zallik",
    name: "Go'zallik saloni",
    namePlural: "Go'zallik salonlari",
    description: "Go'zallik salonlari, sartaroshxonalar va spa markazlari haqida.",
    metaTitle: "Go'zallik salonlari | Top Reyting",
    metaDescription: "Go'zallik xizmatlari haqida qo'llanmalar.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
  },
  {
    slug: "konsalting",
    name: "Konsalting",
    namePlural: "Konsalting kompaniyalari",
    description: "Biznes, moliya va boshqaruv konsalting xizmatlari haqida.",
    metaTitle: "Konsalting kompaniyalari | Top Reyting",
    metaDescription: "Konsalting kompaniyalari haqida tahlillar.",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-600",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Categories that have at least one listing OR at least one article. Used for header dropdown. */
export function getActiveCategorySlugs(articleCategorySlugs: string[] = []): string[] {
  const fromListings = getCategorySlugsWithListings();
  const set = new Set<string>([...fromListings, ...articleCategorySlugs]);
  return Array.from(set);
}

export function getActiveCategories(articleCategorySlugs: string[] = []): Category[] {
  const slugs = new Set(getActiveCategorySlugs(articleCategorySlugs));
  return categories.filter((c) => slugs.has(c.slug));
}
