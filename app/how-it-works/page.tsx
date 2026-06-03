import type { Metadata } from "next";
import { ClipboardList, Phone, ShieldCheck, Rocket, Award, Check } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Faq from "@/components/Faq";
import { howItWorksFaqItems } from "@/content/faq";
import { PRICING, formatCurrency } from "@/lib/pricing";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `How It Works — ${siteConfig.name}`,
  description:
    "Learn how to apply, get reviewed, go live, and be recognized. Four steps to getting listed on TopEntrepreneurs.com.",
};

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    heading: "Tell Us About Your Business",
    body: "Tell us about your business, your founders, and the cities you operate in. The submission takes about 5 minutes and includes a transparent pricing estimate.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    heading: "Get Reviewed",
    body: "Our team verifies your business's standing. Every qualifying entrepreneur is accepted. If we need anything to finalize your listing, we'll reach out directly.",
  },
  {
    icon: Rocket,
    step: "03",
    heading: "Go Live",
    body: "Your listing debuts at the coordinated October 2026 launch alongside all listed entrepreneurs — a national reveal with press coverage and awareness campaigns.",
  },
  {
    icon: Award,
    step: "04",
    heading: "Be Recognized",
    body: "Receive your custom recognition award, attend the Awards & Recognition Dinner, and display the Top Entrepreneurs badge on your own website.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              The Process
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              How It Works
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-white/70 text-xl leading-relaxed">
              Four steps from submission to recognition. The process is simple —
              we handle the rest.
            </p>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="bg-white py-20 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden lg:block absolute left-10 top-10 bottom-10 w-px bg-cream-dark" />

              <div className="space-y-12">
                {steps.map(({ icon: Icon, step, heading, body }) => (
                  <div key={step} className="flex gap-8 items-start">
                    <div className="flex-shrink-0 relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-navy border-4 border-white shadow-lg">
                      <Icon className="h-6 w-6 text-gold" />
                      <span className="text-[10px] text-gold/70 font-mono mt-0.5">{step}</span>
                    </div>
                    <div className="pt-4">
                      <h2 className="font-display text-2xl font-bold text-navy mb-3">
                        {heading}
                      </h2>
                      <p className="text-muted text-lg leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Get Listed
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-lg border border-navy/20 bg-cream px-5 py-3 text-sm font-semibold text-navy hover:bg-cream-dark hover:border-gold/50 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold" />
                Questions? Call&nbsp;<span className="text-gold">{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="bg-cream py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-navy mb-4 text-center">
              Pricing
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-10" />

            <div className="space-y-4">
              {[
                {
                  label: "Annual listing fee",
                  price: `${formatCurrency(PRICING.primaryIndustry)} / city`,
                  features: [
                    "Full business profile with photo & description",
                    "Custom recognition award",
                    "Invitation to the Awards & Recognition Dinner",
                    "Eligibility for the Top Entrepreneurs honor",
                  ],
                },
                {
                  label: "Each additional city",
                  price: `${formatCurrency(PRICING.primaryIndustry)} / city`,
                  features: [
                    "Same flat rate — no premium for expanding your reach",
                    "All categories included in every city",
                  ],
                },
              ].map(({ label, price, features }) => (
                <div
                  key={label}
                  className="rounded-xl border border-cream-dark bg-white p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h3 className="font-display text-lg font-semibold text-navy">
                      {label}
                    </h3>
                    <span className="font-display text-2xl font-bold text-gold whitespace-nowrap">
                      {price}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                        <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted mt-6">
              Annual listing. All listings debut at the October 2026 launch. All recognition categories included.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Get Listed
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-lg border border-navy/20 bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-cream hover:border-gold/50 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold" />
                Call&nbsp;<span className="text-gold">{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Faq
        items={howItWorksFaqItems}
        title="Common Questions"
        light={false}
      />
    </>
  );
}
