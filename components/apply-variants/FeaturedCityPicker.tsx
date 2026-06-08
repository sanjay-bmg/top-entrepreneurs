"use client";

import { formatCurrency, PRICING } from "@/lib/pricing";

interface Props {
  cities: { city: string; state: string }[];
  excludedFeatured: string[]; // "city|state" keys opted out of the Top Spot
  takenCities: string[]; // "city|state" whose Top Spot is already claimed
  onToggle: (key: string) => void;
}

/**
 * Per-city Top Spot selector — pick which cities get the single premium slot
 * and which get a standard listing. Mirrors the grid inside PricingEstimate so
 * every variant behaves the same way.
 */
export default function FeaturedCityPicker({ cities, excludedFeatured, takenCities, onToggle }: Props) {
  const valid = cities.filter((c) => c.city && c.state);
  if (valid.length === 0) return null;

  const rows = valid.map((loc) => {
    const key = `${loc.city}|${loc.state}`;
    return {
      key,
      label: `${loc.city}, ${loc.state}`,
      taken: takenCities.includes(key),
      excluded: excludedFeatured.includes(key),
    };
  });

  return (
    <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 space-y-2">
      <p className="text-xs font-semibold text-navy">
        Choose your Top Spot cities — {formatCurrency(PRICING.featuredCity)} / city
      </p>
      <p className="text-xs text-muted">
        Only one business per city can hold it. Uncheck any city where you just want a standard listing.
      </p>
      <div className="space-y-1.5 pt-1">
        {rows.map((row) => (
          <label
            key={row.key}
            className={`flex items-center gap-2.5 text-sm rounded-lg px-3 py-2 transition-colors ${
              row.taken
                ? "opacity-50 cursor-not-allowed bg-red-50"
                : row.excluded
                ? "text-muted cursor-pointer"
                : "text-navy hover:bg-gold/5 cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={!row.excluded && !row.taken}
              disabled={row.taken}
              onChange={() => !row.taken && onToggle(row.key)}
              className="h-4 w-4 rounded accent-gold flex-shrink-0"
            />
            <span className={row.excluded || row.taken ? "line-through" : ""}>{row.label}</span>
            {row.taken && <span className="ml-auto text-xs text-red-500 font-medium">Taken</span>}
            {!row.taken && !row.excluded && (
              <span className="ml-auto text-xs text-muted">{formatCurrency(PRICING.featuredCity)}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
