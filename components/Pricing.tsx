import { Check, Phone, Sparkles } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { PRICING, formatCurrency } from "@/lib/pricing";
import { siteConfig } from "@/site.config";

const LISTING_FEATURES = [
  "Full business profile with photo & description",
  "Listed by city and industry",
  "Contact details & client reviews",
  "Custom Top Entrepreneurs recognition award",
  "Eligibility for the Top Entrepreneurs honor",
  "Invitation to the Awards & Recognition Dinner",
  "Top Entrepreneurs badge for your website",
];

export default function Pricing() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
              Transparent Pricing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              Simple, Transparent Pricing
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
            <p className="text-muted max-w-xl mx-auto text-lg leading-relaxed">
              One annual fee per city. Every listing includes your recognition
              award and a place at the Awards &amp; Recognition Dinner.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Limited-Time Launch Pricing — 50% Off
            </div>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-cream-dark bg-white shadow-md p-8 flex flex-col">
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
                Business Listing
              </p>
              <h3 className="font-display text-2xl font-bold text-navy mb-6">
                Your Listing
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-4 rounded-xl bg-cream border border-cream-dark">
                  <div>
                    <p className="font-semibold text-navy text-sm">Annual listing fee</p>
                    <p className="text-xs text-muted mt-0.5">One flat rate per city — all industries included</p>
                  </div>
                  <span className="font-display text-2xl font-bold text-navy">
                    <span className="mr-2 text-base font-normal text-muted/60 line-through">{formatCurrency(PRICING.primaryIndustry * 2)}</span>
                    {formatCurrency(PRICING.primaryIndustry)}
                    <span className="text-sm font-normal text-muted">/yr</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-cream border border-cream-dark">
                  <div>
                    <p className="font-semibold text-navy text-sm">Each additional industry</p>
                    <p className="text-xs text-muted mt-0.5">Expand to every category you serve</p>
                  </div>
                  <span className="font-display text-2xl font-bold text-gold">
                    Free
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                Every listing includes
              </p>
              <ul className="space-y-2.5 flex-1 mb-8">
                {LISTING_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-gold" />
                    <span className="text-sm text-muted leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <Button href="/apply" variant="secondary" size="md" className="w-full">
                Get Listed
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-center text-xs text-muted mt-8 max-w-lg mx-auto">
            Annual listing. Add as many industries as your business serves — all included.
          </p>
          <div className="flex justify-center mt-6">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-lg border border-navy/20 bg-cream px-5 py-3 text-sm font-semibold text-navy hover:bg-cream-dark hover:border-gold/50 transition-colors"
            >
              <Phone className="h-4 w-4 text-gold" />
              Questions? Call&nbsp;<span className="text-gold">{siteConfig.phone}</span>
            </a>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
