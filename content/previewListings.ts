export interface PreviewListing {
  id: number;
  name: string; // founder / owner
  company: string; // business name
  areas: string[]; // industries
  rating: number;
  reviewCount: number;
  phone: string;
  location: string; // city, ST
  servingArea: string;
  imageUrl: string;
  featured?: boolean;
  rank?: number;
}

export const previewListings: PreviewListing[] = [
  {
    id: 1,
    name: "Marcus Hale",
    company: "Halebrook Capital",
    areas: ["Finance & Fintech"],
    rating: 5.0,
    reviewCount: 142,
    phone: "(512) 555-0142",
    location: "Austin, TX",
    servingArea: "Greater Austin Metro",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Elena Ruiz",
    company: "Verdant Foods Co.",
    areas: ["Food & Beverage", "Consumer Products"],
    rating: 4.9,
    reviewCount: 311,
    phone: "(512) 555-0388",
    location: "Austin, TX",
    servingArea: "Serving Central Texas",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    rank: 1,
  },
  {
    id: 3,
    name: "Priya Anand",
    company: "Lumen Health",
    areas: ["Health & Wellness"],
    rating: 4.9,
    reviewCount: 268,
    phone: "(512) 555-0210",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    imageUrl:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&q=80",
    rank: 2,
  },
  {
    id: 4,
    name: "Sofia Bennett",
    company: "Atlas Logistics",
    areas: ["Logistics & Transportation"],
    rating: 4.8,
    reviewCount: 194,
    phone: "(512) 555-0455",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    rank: 3,
  },
  {
    id: 5,
    name: "Devin Park",
    company: "Northbeam Software",
    areas: ["Technology & Software"],
    rating: 4.8,
    reviewCount: 176,
    phone: "(512) 555-0512",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    rank: 4,
  },
];
