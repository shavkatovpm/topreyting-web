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

export const listings: Listing[] = [];

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
