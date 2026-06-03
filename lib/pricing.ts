// Placeholder pricing — edit these three numbers and they propagate to the
// landing page, how-it-works, the live apply estimate, and the email quote.
export const PRICING = {
  primaryIndustry: 289, // flat annual rate per city (all categories included)
} as const;

export interface QuoteInput {
  industries: string[];
  cities: { city: string; state: string }[];
}

export interface QuoteLineItem {
  label: string;
  amount: number;
}

export interface Quote {
  lineItems: QuoteLineItem[];
  total: number;
}

export function calculateQuote({ industries, cities }: QuoteInput): Quote {
  const lineItems: QuoteLineItem[] = [];
  const industryCount = industries.length;
  const cityCount = Math.max(1, cities.length);

  if (industryCount >= 1) {
    lineItems.push({
      label: `Annual listing × ${cityCount} cit${cityCount > 1 ? "ies" : "y"}`,
      amount: PRICING.primaryIndustry * cityCount,
    });
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
