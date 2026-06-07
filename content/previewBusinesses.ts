export interface PreviewTeamMember {
  name: string;
  title: string;
}

export interface PreviewReview {
  author: string;
  text: string;
}

export interface PreviewBusiness {
  id: number;
  name: string; // business name
  categories: string[];
  rating: number;
  reviewCount: number;
  phone: string;
  location: string;
  servingArea: string;
  imageUrl: string;
  rank?: number;
  about: string;
  team: PreviewTeamMember[];
  reviews: PreviewReview[];
}

/**
 * Sample businesses for the "What Your Listing Looks Like" preview.
 * [0] is shown as the Top Spot; [1] is shown as the profile page; ranked
 * entries populate the directory list.
 */
export const previewBusinesses: PreviewBusiness[] = [
  {
    id: 1,
    name: "Halebrook Capital",
    categories: ["Finance & Fintech"],
    rating: 5.0,
    reviewCount: 142,
    phone: "(512) 555-0142",
    location: "Austin, TX",
    servingArea: "Greater Austin Metro",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    about:
      "recognized across Greater Austin for hands-on wealth management, capital advisory, and a client-first approach to building lasting financial outcomes.",
    team: [
      { name: "Marcus Hale", title: "Founder & Managing Partner" },
      { name: "Dana Whitfield", title: "Head of Advisory" },
    ],
    reviews: [
      { author: "K. Nguyen", text: "Sharp, responsive, and genuinely invested in our growth." },
      { author: "P. Alvarez", text: "Best capital partner we've worked with — period." },
    ],
  },
  {
    id: 2,
    name: "Verdant Foods Co.",
    categories: ["Food & Beverage", "Consumer Products"],
    rating: 4.9,
    reviewCount: 311,
    phone: "(512) 555-0388",
    location: "Austin, TX",
    servingArea: "Serving Central Texas",
    rank: 1,
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    about:
      "recognized across Central Texas for crafting better-for-you packaged foods, with a fast-growing brand built on quality, sustainability, and taste.",
    team: [
      { name: "Elena Ruiz", title: "Founder & CEO" },
      { name: "Marc Oduya", title: "Head of Operations" },
    ],
    reviews: [
      { author: "M. Torres", text: "Standout brand and a team that consistently delivers." },
      { author: "R. Patel", text: "Quality you can taste — highly recommend." },
    ],
  },
  {
    id: 3,
    name: "Lumen Health",
    categories: ["Health & Wellness"],
    rating: 4.9,
    reviewCount: 268,
    phone: "(512) 555-0210",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    rank: 2,
    imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&q=80",
    about:
      "a modern wellness practice helping Austinites feel their best through preventive care, coaching, and a patient-first experience.",
    team: [
      { name: "Priya Anand", title: "Founder & CEO" },
      { name: "Tomás Vela", title: "Clinical Director" },
    ],
    reviews: [
      { author: "J. Kim", text: "Caring team and a truly modern experience." },
      { author: "S. Brooks", text: "They actually listen. Couldn't recommend more." },
    ],
  },
  {
    id: 4,
    name: "Atlas Logistics",
    categories: ["Logistics & Transportation"],
    rating: 4.8,
    reviewCount: 194,
    phone: "(512) 555-0455",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    rank: 3,
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    about:
      "a regional logistics operator known for reliable freight, smart routing, and a team that treats every shipment like its own.",
    team: [
      { name: "Sofia Bennett", title: "Founder & CEO" },
      { name: "Greg Halloran", title: "VP, Operations" },
    ],
    reviews: [
      { author: "D. Cole", text: "On time, every time. A true partner." },
      { author: "L. Fischer", text: "Made our supply chain dramatically smoother." },
    ],
  },
  {
    id: 5,
    name: "Northbeam Software",
    categories: ["Technology & Software"],
    rating: 4.8,
    reviewCount: 176,
    phone: "(512) 555-0512",
    location: "Austin, TX",
    servingArea: "Serving Austin Metro",
    rank: 4,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    about:
      "a product studio building dependable software for growing companies, recognized for craftsmanship and a results-driven team.",
    team: [
      { name: "Devin Park", title: "Founder & CEO" },
      { name: "Aisha Rahman", title: "Head of Engineering" },
    ],
    reviews: [
      { author: "T. Walsh", text: "Shipped exactly what we needed, fast." },
      { author: "N. Ortiz", text: "Rare combination of speed and quality." },
    ],
  },
];
