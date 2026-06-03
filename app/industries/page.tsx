import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { industryGroups } from "@/content/industries";
import { PRICING, formatCurrency } from "@/lib/pricing";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Recognition Categories — ${siteConfig.name}`,
  description:
    "TopEntrepreneurs.com covers 18 major recognition categories, each with dozens of sub-categories. Apply to be listed in every category that fits your business.",
};

export default function IndustriesPage() {
  const totalSubCategories = industryGroups.reduce(
    (sum, g) => sum + g.includes.length,
    0,
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Coverage
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Recognition Categories
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-white/70 text-xl leading-relaxed">
              {siteConfig.name} lists founders across {industryGroups.length}{" "}
              major recognition categories — each covering multiple sub-categories.
              Apply in one or many — all categories are included for{" "}
              <span className="text-gold font-semibold">
                {formatCurrency(PRICING.primaryIndustry)}
              </span>{" "}
              per city.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats bar */}
      <div className="bg-navy-light border-y border-white/10 py-5">
        <Container>
          <div className="flex flex-wrap gap-8 justify-center sm:justify-start text-center sm:text-left">
            <div>
              <p className="font-display text-3xl font-bold text-gold">
                {industryGroups.length}
              </p>
              <p className="text-xs text-white/50 uppercase tracking-widest">
                Categories
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gold">
                {totalSubCategories}+
              </p>
              <p className="text-xs text-white/50 uppercase tracking-widest">
                Sub-Categories
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gold">50</p>
              <p className="text-xs text-white/50 uppercase tracking-widest">
                States
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Category groups */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {industryGroups.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-cream-dark p-6 hover:border-gold/40 transition-colors"
              >
                <h2 className="font-display text-lg font-bold text-navy mb-1">
                  {group.category}
                </h2>
                <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-4 pb-3 border-b border-cream-dark">
                  {formatCurrency(PRICING.primaryIndustry)} / city · all categories included
                </p>
                <p className="text-xs text-muted font-medium uppercase tracking-widest mb-2">
                  Includes
                </p>
                <ul className="space-y-1.5">
                  {group.includes.map((spec) => (
                    <li
                      key={spec}
                      className="text-sm text-muted flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-navy p-10 text-center">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
              Don&apos;t see your category?
            </p>
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              We cover it — apply anyway.
            </h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              If your exact category isn&apos;t listed, apply under the closest
              match and note your focus in the application. Our team reviews
              all submissions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Apply to be Listed
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold" />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
