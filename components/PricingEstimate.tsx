import { calculateQuote, formatCurrency, PRICING } from "@/lib/pricing";
import { siteConfig } from "@/site.config";

interface PricingEstimateProps {
  industries: string[];
  cities: { city: string; state: string }[];
  featured: boolean;
  excludedFeatured: string[]; // "city|state" keys opted out
  takenCities: string[]; // "city|state" whose Featured spot is already taken
  onToggleFeatured: (key: string) => void;
}

export default function PricingEstimate({
  industries,
  cities,
  featured,
  excludedFeatured,
  takenCities,
  onToggleFeatured,
}: PricingEstimateProps) {
  const validCities = cities.filter((l) => l.city && l.state);
  // Taken cities must also be excluded from the quote — they can't be purchased
  const { lineItems, total } = calculateQuote({
    industries,
    cities: validCities,
    featured,
    excludedFeatured: [...new Set([...excludedFeatured, ...takenCities])],
  });

  if (industries.length === 0 && !featured) return null;

  // One Featured slot per city — build the per-city grid
  const featuredGrid =
    featured && validCities.length > 0
      ? validCities.map((loc) => {
          const key = `${loc.city}|${loc.state}`;
          return {
            key,
            label: `${loc.city}, ${loc.state}`,
            taken: takenCities.includes(key),
            excluded: excludedFeatured.includes(key),
          };
        })
      : [];

  const hasTaken = featuredGrid.some((r) => r.taken);

  return (
    <div className="rounded-xl border border-gold/30 bg-navy/5 p-5 space-y-4">
      <p className="text-xs font-semibold text-navy uppercase tracking-widest">
        Estimated Quote
      </p>

      {/* Line items */}
      {lineItems.length > 0 && (
        <div className="space-y-2">
          {lineItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="font-medium text-navy">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Featured listing — one per city */}
      {featuredGrid.length > 0 && (
        <div className="border-t border-gold/20 pt-4 space-y-2">
          <p className="text-xs font-semibold text-navy">
            Featured Listing — {formatCurrency(PRICING.featuredCity)} / city
          </p>
          <p className="text-xs text-muted">
            Only one business per city can hold this. Uncheck any city you don&apos;t want it in.
          </p>
          <div className="space-y-1.5">
            {featuredGrid.map((row) => (
              <label
                key={row.key}
                className={`flex items-center gap-2.5 text-sm cursor-pointer rounded-lg px-3 py-2 transition-colors ${
                  row.taken
                    ? "opacity-50 cursor-not-allowed bg-red-50"
                    : row.excluded
                    ? "text-muted"
                    : "text-navy hover:bg-gold/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!row.excluded && !row.taken}
                  disabled={row.taken}
                  onChange={() => !row.taken && onToggleFeatured(row.key)}
                  className="h-4 w-4 rounded accent-gold flex-shrink-0"
                />
                <span className={row.excluded || row.taken ? "line-through" : ""}>
                  {row.label}
                </span>
                {row.taken && (
                  <span className="ml-auto text-xs text-red-500 font-medium">Taken</span>
                )}
                {!row.taken && !row.excluded && (
                  <span className="ml-auto text-xs text-muted">{formatCurrency(PRICING.featuredCity)}</span>
                )}
              </label>
            ))}
          </div>

          {hasTaken && (
            <p className="text-xs text-red-600 mt-1">
              The Featured spot is already claimed in one or more of your cities.{" "}
              <a href={siteConfig.phoneHref} className="font-medium underline hover:text-red-700 transition-colors">
                Call us at {siteConfig.phone}
              </a>{" "}
              to discuss your options.
            </p>
          )}
        </div>
      )}

      {/* Total */}
      <div className="pt-3 border-t border-gold/20 flex justify-between items-center">
        <span className="font-semibold text-navy">Estimated total</span>
        <span className="font-display text-2xl font-bold text-gold">
          {formatCurrency(total)}
        </span>
      </div>

      <p className="text-xs text-muted">
        Estimate shown for transparency. Our team will confirm pricing when they follow up.
      </p>
    </div>
  );
}
