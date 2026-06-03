import { calculateQuote, formatCurrency } from "@/lib/pricing";

interface PricingEstimateProps {
  industries: string[];
  cities: { city: string; state: string }[];
}

export default function PricingEstimate({ industries, cities }: PricingEstimateProps) {
  const validCities = cities.filter((l) => l.city && l.state);
  const { lineItems, total } = calculateQuote({ industries, cities: validCities });

  if (industries.length === 0) return null;

  return (
    <div className="rounded-xl border border-gold/30 bg-navy/5 p-5 space-y-4">
      <p className="text-xs font-semibold text-navy uppercase tracking-widest">
        Estimated Quote
      </p>

      {lineItems.length > 0 && (
        <div className="space-y-2">
          {lineItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="font-medium text-navy">
                {item.amount === 0 ? "Free" : formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

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
