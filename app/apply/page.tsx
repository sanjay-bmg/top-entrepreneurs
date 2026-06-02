import type { Metadata } from "next";
import { Phone, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";
import ApplyForm from "@/components/ApplyForm";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Apply to be Listed — ${siteConfig.name}`,
  description:
    "Apply to be listed on TopEntrepreneurs.com. Every qualifying business is accepted. Listings debut at the 2027 launch.",
};

export default function ApplyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Listing Application
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Business &amp; Founder Profile
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-white/70 text-xl leading-relaxed max-w-2xl">
              Submit your application and your listing will go live at the 2027 directory launch.
            </p>
            <div className="mt-6">
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-lg border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/20 hover:border-gold/60 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Prefer to talk? Call&nbsp;{siteConfig.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <div className="bg-navy-light border-b border-white/10 py-4">
        <Container>
          <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start text-xs text-white/60">
            {[
              "Listings debut at the 2027 launch",
              "Every qualifying business accepted",
              "One Featured spot per city",
              "Custom recognition award included",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                {item}
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Form */}
      <section className="bg-cream py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-cream-dark shadow-sm p-8 sm:p-12">
            <ApplyForm />
          </div>
        </Container>
      </section>
    </>
  );
}
