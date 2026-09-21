import { site } from "./site";
import { getCity } from "@/data/cities";
import type { Brand } from "@/generated/prisma/client";
import type { Article } from "./articles";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    description: site.description,
    sameAs: [site.social.telegram, site.social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "customer support",
      availableLanguage: ["uz"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "uz",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/qidiruv?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${site.url}${item.url}`,
    })),
  };
}

/**
 * Brend uchun structured data. FAQAT sahifada ko'rsatilgan real ma'lumotlar.
 * Reyting pullik bo'lgani uchun aggregateRating / Review HECH QACHON qo'shilmaydi.
 * Manzil bo'lsa LocalBusiness, bo'lmasa Organization.
 */
export function brandJsonLd(brand: Brand, categorySlug: string) {
  const url = `${site.url}/${categorySlug}/${brand.slug}`;
  const city = brand.city ? getCity(brand.city) : undefined;
  const sameAs = [brand.websiteUrl, brand.instagramUrl, brand.telegramUrl].filter(Boolean);
  const alternateName = Array.isArray(brand.alternateNames) ? (brand.alternateNames as string[]) : [];

  return {
    "@context": "https://schema.org",
    "@type": brand.address ? "LocalBusiness" : "Organization",
    "@id": url,
    name: brand.name,
    alternateName: alternateName.length ? alternateName : undefined,
    description: brand.shortDescription,
    url,
    logo: brand.logoUrl ?? undefined,
    telephone: brand.phone ?? undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: brand.address
      ? {
          "@type": "PostalAddress",
          streetAddress: brand.address,
          addressLocality: city?.name,
          addressRegion: city?.region,
          addressCountry: "UZ",
        }
      : undefined,
    priceRange: brand.priceRange ?? undefined,
    foundingDate: brand.yearFounded?.toString(),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function articleJsonLd(article: Article) {
  const author = article.author
    ? {
        "@type": "Person" as const,
        name: article.author.name,
        jobTitle: article.author.role,
      }
    : {
        "@type": "Organization" as const,
        name: site.name,
        url: site.url,
      };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.cover ? `${site.url}${article.cover}` : `${site.url}${site.ogImage}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/maqolalar/${article.slug}`,
    },
    inLanguage: "uz",
  };
}

/** Kategoriya ro'yxati: faqat tartib va havola, baho yo'q. */
export function itemListJsonLd(
  brands: { name: string; slug: string; categorySlug?: string }[],
  categorySlug?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: brands.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      url: `${site.url}/${b.categorySlug ?? categorySlug}/${b.slug}`,
    })),
  };
}

