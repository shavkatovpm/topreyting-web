import { site } from "./site";
import type { Listing } from "@/data/listings";
import type { Category } from "@/data/categories";
import type { City } from "@/data/cities";
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

export function localBusinessJsonLd(listing: Listing, category: Category, city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/${category.slug}/${city.slug}/${listing.slug}`,
    name: listing.name,
    description: listing.shortDescription,
    url: `${site.url}/${category.slug}/${city.slug}/${listing.slug}`,
    telephone: listing.phone,
    email: listing.email,
    address: listing.address
      ? {
          "@type": "PostalAddress",
          streetAddress: listing.address,
          addressLocality: city.name,
          addressRegion: city.region,
          addressCountry: "UZ",
        }
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: listing.rating.toFixed(1),
      reviewCount: listing.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: listing.priceRange,
    openingHours: listing.workingHours,
    foundingDate: listing.yearFounded?.toString(),
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

export function itemListJsonLd(listings: Listing[], categorySlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: l.name,
        url: `${site.url}/${categorySlug}/${l.city}/${l.slug}`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: l.rating.toFixed(1),
          reviewCount: l.reviewCount,
        },
      },
    })),
  };
}

