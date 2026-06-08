import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import Container from "@/components/Container";
import { VARIANTS } from "./variants";

/** Renders a single bake-off variant on its own page, with jump-nav + prev/next. */
export default function CompareShell({ index }: { index: number }) {
  const v = VARIANTS[index];
  const prev = index > 0 ? VARIANTS[index - 1] : null;
  const next = index < VARIANTS.length - 1 ? VARIANTS[index + 1] : null;
  const Form = v.Component;
  const widthClass = v.wide ? "max-w-5xl" : "max-w-3xl";

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-12">
        <Container>
          {/* Jump nav between forms */}
          <div className="flex flex-wrap gap-2 mb-7">
            {VARIANTS.map((x) => {
              const active = x.slug === v.slug;
              return (
                <Link
                  key={x.slug}
                  href={`/apply/${x.slug}`}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-gold bg-gold text-navy"
                      : "border-white/15 bg-white/5 text-white/80 hover:bg-gold/15 hover:border-gold/50 hover:text-white"
                  }`}
                >
                  <span className={active ? "text-navy" : "text-gold"}>{x.tag}</span>
                  {x.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-xl font-bold text-navy">
              {v.tag}
            </div>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">
                Form {v.tag} · {index + 1} of {VARIANTS.length}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">{v.name}</h1>
              <p className="text-white/70 mt-3 leading-relaxed">{v.blurb}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="bg-cream py-12 lg:py-16">
        <Container>
          <div className={`${widthClass} mx-auto bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sm:p-10`}>
            <Form />
          </div>

          {/* Prev / index / next */}
          <div className={`${widthClass} mx-auto mt-8 flex items-center justify-between gap-3`}>
            {prev ? (
              <Link href={`/apply/${prev.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors">
                <ArrowLeft className="h-4 w-4" /> {prev.tag} · {prev.name}
              </Link>
            ) : (
              <span />
            )}
            <Link href="/apply/compare" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
              <LayoutGrid className="h-4 w-4" /> All forms
            </Link>
            {next ? (
              <Link href={`/apply/${next.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors">
                {next.tag} · {next.name} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
