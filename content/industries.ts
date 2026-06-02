export interface IndustryGroup {
  category: string; // the purchasable name — shown to applicants and used in the form
  includes: string[]; // example sub-categories (helper text only)
}

export const industryGroups: IndustryGroup[] = [
  {
    category: "Technology & Software",
    includes: [
      "SaaS", "Mobile Apps", "AI / Machine Learning", "Cybersecurity",
      "Cloud Services", "Developer Tools", "IT Services", "Web3 / Blockchain",
    ],
  },
  {
    category: "E-Commerce & Retail",
    includes: [
      "Direct-to-Consumer Brands", "Online Marketplaces", "Subscription Boxes",
      "Dropshipping", "Brick-and-Mortar Retail", "Consumer Electronics",
    ],
  },
  {
    category: "Real Estate & Property",
    includes: [
      "Residential Development", "Commercial Real Estate", "Property Management",
      "Real Estate Investment", "PropTech", "Short-Term Rentals",
    ],
  },
  {
    category: "Health & Wellness",
    includes: [
      "Medical Practices", "Fitness & Gyms", "Mental Health", "Telehealth",
      "Supplements & Nutrition", "Med Spas", "Wellness Coaching",
    ],
  },
  {
    category: "Food & Beverage",
    includes: [
      "Restaurants", "Cafés & Coffee", "Food Trucks", "Catering",
      "Packaged Foods (CPG)", "Breweries & Distilleries", "Ghost Kitchens",
    ],
  },
  {
    category: "Professional Services",
    includes: [
      "Consulting", "Accounting & Bookkeeping", "Legal Services",
      "HR & Recruiting", "Business Coaching", "Insurance",
    ],
  },
  {
    category: "Finance & Fintech",
    includes: [
      "Payments", "Lending", "Wealth Management", "Investment Firms",
      "Crypto & Digital Assets", "Insurtech",
    ],
  },
  {
    category: "Marketing & Media",
    includes: [
      "Digital Agencies", "Advertising", "Public Relations",
      "Content & Publishing", "Creator / Influencer", "Video Production",
    ],
  },
  {
    category: "Manufacturing & Industrial",
    includes: [
      "Product Manufacturing", "Industrial Equipment", "Aerospace & Defense",
      "Textiles", "3D Printing", "Contract Manufacturing",
    ],
  },
  {
    category: "Construction & Trades",
    includes: [
      "General Contracting", "Home Services", "HVAC", "Electrical",
      "Plumbing", "Landscaping", "Roofing", "Remodeling",
    ],
  },
  {
    category: "Education & Training",
    includes: [
      "EdTech", "Tutoring", "Vocational Training", "Online Courses",
      "Childcare & Preschools", "Corporate Training",
    ],
  },
  {
    category: "Hospitality & Travel",
    includes: [
      "Hotels & Lodging", "Travel Agencies", "Event Planning",
      "Tourism", "Vacation Rentals", "Experiences",
    ],
  },
  {
    category: "Logistics & Transportation",
    includes: [
      "Freight & Trucking", "Last-Mile Delivery", "Warehousing",
      "Supply Chain", "Fleet Services", "Courier",
    ],
  },
  {
    category: "Energy & Sustainability",
    includes: [
      "Solar & Renewables", "Clean Tech", "EV & Charging",
      "Waste & Recycling", "Energy Efficiency", "Sustainability Consulting",
    ],
  },
  {
    category: "Consumer Products",
    includes: [
      "Beauty & Cosmetics", "Apparel & Fashion", "Home Goods",
      "Pet Products", "Toys & Games", "Outdoor & Sporting Goods",
    ],
  },
  {
    category: "Creative & Design",
    includes: [
      "Design Studios", "Architecture", "Interior Design",
      "Photography", "Branding", "Product Design",
    ],
  },
  {
    category: "Automotive",
    includes: [
      "Dealerships", "Auto Repair", "Detailing",
      "Aftermarket Parts", "Mobility & Rideshare", "Auto Tech",
    ],
  },
  {
    category: "Franchise & Multi-Unit",
    includes: [
      "Franchise Brands", "Multi-Unit Operators",
      "Franchise Development", "Area Development",
    ],
  },
];

export const allIndustries: string[] = industryGroups.map((g) => g.category);
