import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { siteConfig } from "@/site.config";
import { VARIANTS } from "@/components/apply-variants/variants";

export const metadata: Metadata = {
  title: `Apply Form Bake-Off — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function CompareIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-14">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Internal · Form Bake-Off
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Five intake forms, one sheet
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-5" />
            <p className="text-white/70 text-lg leading-relaxed">
              Each form is on its own page now — open them one at a time. They all submit to the{" "}
              <strong className="text-white">same Applications sheet</strong>, tagged with the form they came from
              (the <em>Form Variant</em> column). Try each, then pick a winner.
            </p>
          </div>
        </Container>
      </section>

      {/* Form cards */}
      <section className="bg-cream py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            {VARIANTS.map((v) => (
              <Link
                key={v.slug}
                href={`/apply/${v.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-cream-dark bg-white p-6 shadow-sm transition-colors hover:border-gold/60"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-navy text-lg font-bold text-white group-hover:bg-gold group-hover:text-navy transition-colors">
                  {v.tag}
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold text-navy">{v.name}</h2>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{v.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    Open form <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-center text-xs text-muted/70 mt-8">
            Internal preview — not indexed. Each form&apos;s URL: /apply/compare1 … /apply/compare5
          </p>
        </Container>
      </section>
    </>
  );
}
