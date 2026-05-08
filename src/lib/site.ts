export const site = {
  name: "Top Reyting",
  shortName: "TopReyting",
  domain: "topreyting.uz",
  url: "https://topreyting.uz",
  locale: "uz_UZ",
  lang: "uz",
  description:
    "O'zbekistondagi klinikalar, agentliklar, mutaxassislar, bizneslar va startaplar haqida mustaqil tahlillar va qo'llanmalar.",
  tagline: "O'zbekistondagi eng yaxshilarni tanlash bo'yicha mustaqil qo'llanmalar",
  keywords: [
    "top reyting",
    "eng yaxshi klinikalar",
    "eng yaxshi agentliklar",
    "biznes reyting",
    "mutaxassislar reytingi",
    "startaplar O'zbekiston",
    "kompaniyalar reytingi",
  ],
  author: "Top Reyting",
  email: "info@topreyting.uz",
  social: {
    telegram: "https://t.me/topreyting",
    instagram: "https://instagram.com/topreyting.uz",
  },
  ogImage: "/og-default.png",
} as const;

export type SiteConfig = typeof site;
