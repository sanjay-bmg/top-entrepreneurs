// Placeholder pricing — edit these three numbers and they propagate to the
// landing page, how-it-works, the live apply estimate, and the email quote.
export const PRICING = {
  primaryIndustry: 289, // first industry ($/yr, per city)
  additionalIndustry: 89, // each additional industry ($/yr, per city)
  featuredCity: 689, // Featured listing — the single top spot ($/yr, one per city)
} as const;

export interface QuoteInput {
  industries: string[];
  cities: { city: string; state: string }[];
  featured: boolean;
  // "city|state" keys the user has opted out of for the Featured listing
  excludedFeatured: string[];
}

export interface QuoteLineItem {
  label: string;
  amount: number;
}

export interface Quote {
  lineItems: QuoteLineItem[];
  total: number;
}

export function calculateQuote({ industries, cities, featured, excludedFeatured }: QuoteInput): Quote {
  const lineItems: QuoteLineItem[] = [];
  const industryCount = industries.length;
  const cityCount = Math.max(1, cities.length);

  if (industryCount >= 1) {
    lineItems.push({
      label: `Primary industry × ${cityCount} cit${cityCount > 1 ? "ies" : "y"}`,
      amount: PRICING.primaryIndustry * cityCount,
    });
  }

  if (industryCount > 1) {
    const additionalCount = industryCount - 1;
    lineItems.push({
      label: `${additionalCount} additional ${additionalCount > 1 ? "industries" : "industry"} × ${cityCount} cit${cityCount > 1 ? "ies" : "y"}`,
      amount: additionalCount * PRICING.additionalIndustry * cityCount,
    });
  }

  if (featured) {
    // One Featured listing per city — count cities not opted out
    const includedCities = cities.filter(
      (loc) => !excludedFeatured.includes(`${loc.city}|${loc.state}`),
    ).length;
    if (includedCities > 0) {
      lineItems.push({
        label: `Featured listing × ${includedCities} cit${includedCities > 1 ? "ies" : "y"}`,
        amount: PRICING.featuredCity * includedCities,
      });
    }
  }

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
  return { lineItems, total };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}
