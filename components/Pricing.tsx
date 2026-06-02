import { Check, Crown, Phone, Sparkles } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { LaurelLeft, LaurelRight } from "./LaurelWreath";
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

const FEATURED_FEATURES = [
  "The single top spot on your city page",
  "Placed above every other business",
  "Only one business per city — ever",
  "Maximum visibility for every visitor",
  "Premium Featured badge",
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
              One annual fee per industry, per city. Every listing includes your
              recognition award and a place at the Awards &amp; Recognition Dinner.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Limited-Time Launch Pricing — 50% Off
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Left: Listing */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-cream-dark bg-white shadow-md p-8 flex flex-col h-full">
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
                Business Listing
              </p>
              <h3 className="font-display text-2xl font-bold text-navy mb-6">
                Your Listing
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-4 rounded-xl bg-cream border border-cream-dark">
                  <div>
                    <p className="font-semibold text-navy text-sm">First industry</p>
                    <p className="text-xs text-muted mt-0.5">Your primary listing category, per city</p>
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
                  <span className="font-display text-2xl font-bold text-navy">
                    <span className="mr-2 text-base font-normal text-muted/60 line-through">{formatCurrency(PRICING.additionalIndustry * 2)}</span>
                    {formatCurrency(PRICING.additionalIndustry)}
                    <span className="text-sm font-normal text-muted">/yr</span>
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

          {/* Right: Featured listing (navy, scarce) */}
          <FadeIn delay={0.15}>
            <div className="relative rounded-2xl border border-gold/40 bg-navy shadow-xl p-8 flex flex-col h-full overflow-hidden">
              <LaurelLeft className="absolute -left-3 top-6 h-28 w-12 text-gold/15 pointer-events-none" />
              <LaurelRight className="absolute -right-3 top-6 h-28 w-12 text-gold/15 pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-gold" />
                <p className="text-xs font-semibold text-gold uppercase tracking-widest">
                  Featured Listing — One Per City
                </p>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">
                The Top Spot
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Only one business can hold it in each city.
              </p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-2xl font-normal text-white/40 line-through">
                  {formatCurrency(PRICING.featuredCity * 2)}
                </span>
                <span className="font-display text-4xl font-bold text-gold">
                  {formatCurrency(PRICING.featuredCity)}
                </span>
                <span className="text-sm text-white/60">/yr per city</span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {FEATURED_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-gold" />
                    <span className="text-sm text-white/80 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <Button href="/apply" variant="primary" size="md" className="w-full">
                Claim Your City
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="text-center text-xs text-muted mt-8 max-w-lg mx-auto">
            Annual listing. Featured availability is first-come, first-served — one per city.
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
