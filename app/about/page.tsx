import type { Metadata } from "next";
import { Phone, Target, ShieldCheck, Globe } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `About — ${siteConfig.name}`,
  description:
    "TopEntrepreneurs.com is the premier recognition directory for founders and business owners across the United States. Learn about our mission and our October 2026 launch.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              About Us
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              About {siteConfig.name}
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-white/70 text-xl leading-relaxed">
              {siteConfig.name} was founded to recognize the founders and
              business owners building remarkable companies — and to help people
              discover them.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted leading-relaxed mb-8">
              We are building the most comprehensive recognition directory of
              entrepreneurs in the country — one that founders are proud to be
              part of and that customers, partners, and investors can rely on.
            </p>
            <p className="text-lg text-muted leading-relaxed mb-12">
              Our mission is simple:{" "}
              <strong className="text-navy">
                recognize excellence, elevate top entrepreneurs, and help people
                find the businesses behind them.
              </strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Target,
                  heading: "Our Mission",
                  body: "Recognize the founders and owners building standout businesses across every category and major U.S. city.",
                },
                {
                  icon: ShieldCheck,
                  heading: "Our Standards",
                  body: "Every listed business undergoes a review process. Only legitimate, in-good-standing businesses are accepted.",
                },
                {
                  icon: Globe,
                  heading: "Our Reach",
                  body: "All 50 states. 18 recognition categories. A coordinated October 2026 national launch.",
                },
              ].map(({ icon: Icon, heading, body }) => (
                <div key={heading} className="text-center p-6 rounded-xl border border-cream-dark">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 mb-4">
                    <Icon className="h-6 w-6 text-navy" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy mb-2">{heading}</h3>
                  <p className="text-sm text-muted leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-cream border border-cream-dark p-8 text-center">
              <p className="text-navy font-display text-xl font-semibold mb-2">
                Full team and company details coming soon.
              </p>
              <p className="text-muted text-sm mb-6">
                We are focused on building the best entrepreneur directory in the
                country. In the meantime, learn how the listing process works.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button href="/how-it-works" variant="secondary" size="md">
                  How It Works
                </Button>
                <Button href="/apply" variant="primary" size="md">
                  Apply to be Listed
                </Button>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-cream-dark hover:border-gold/50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  <span>{siteConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
