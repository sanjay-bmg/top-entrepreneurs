import { ArrowRight, Phone } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import { siteConfig } from "@/site.config";

export default function FinalCta() {
  return (
    <section className="bg-navy py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent pointer-events-none" />

      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
            Claim Your Spot
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Be
            <br />
            <span className="text-gold">Recognized?</span>
          </h2>
          <div className="w-12 h-0.5 bg-gold/40 mx-auto mb-8" />
          <p className="text-white/70 text-xl leading-relaxed mb-10">
            Join the nation&apos;s directory of top entrepreneurs. Tell us about
            your business today — and claim your city&apos;s Featured spot before
            someone else does.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/apply" variant="primary" size="lg">
              Tell Us About Your Business
              <ArrowRight className="h-5 w-5" />
            </Button>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-colors"
            >
              <Phone className="h-5 w-5 text-gold" />
              {siteConfig.phone}
            </a>
          </div>
          <p className="text-white/30 text-xs mt-6">
            Prefer to talk? Our team is ready to answer your questions.
          </p>
        </div>
      </Container>
    </section>
  );
}
