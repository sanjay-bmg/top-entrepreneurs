import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Application Received — ${siteConfig.name}`,
};

export default function ThanksPage() {
  return (
    <section className="bg-cream min-h-[70vh] flex items-center py-20">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 border border-gold/30 mb-6">
            <CheckCircle className="h-10 w-10 text-gold" />
          </div>

          <h1 className="font-display text-4xl font-bold text-navy mb-4">
            Application Received
          </h1>
          <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />

          <p className="text-lg text-muted leading-relaxed mb-8">
            Thank you for applying to {siteConfig.name}. Your listing will go live
            at the October 2026 directory launch. If we need anything to finalize your
            listing, we&apos;ll reach out. Questions in the meantime?{" "}
            <a href={siteConfig.phoneHref} className="text-gold hover:text-gold-dark underline transition-colors font-medium">
              Give us a call at {siteConfig.phone}.
            </a>
          </p>

          <p className="text-xs text-muted/70 mb-6">
            Your payment will be processed and appear on your statement as <span className="font-medium">Digital Service Brands</span>.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/" variant="secondary" size="md">
              Back to Home
            </Button>
            <Button href="/how-it-works" variant="outline-gold" size="md">
              Learn What Happens Next
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
