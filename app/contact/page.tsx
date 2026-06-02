import type { Metadata } from "next";
import { Mail, Phone, Clock } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description:
    "Get in touch with the TopEntrepreneurs.com team. Questions about listing your business? Our team is ready to help.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Get More Information
            </h1>
            <div className="w-12 h-0.5 bg-gold mb-6" />
            <p className="text-white/70 text-xl leading-relaxed">
              Questions about listing your business? Our team is here to help.
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Left: contact info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-6">
                Reach Our Team
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Email</p>
                    <a
                      href={`mailto:${siteConfig.salesEmail}`}
                      className="text-gold hover:text-gold-dark transition-colors"
                    >
                      {siteConfig.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Phone</p>
                    <a
                      href={siteConfig.phoneHref}
                      className="text-gold hover:text-gold-dark transition-colors"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Response Time</p>
                    <p className="text-muted">We respond promptly.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-cream border border-cream-dark p-6">
                <p className="font-display text-lg font-semibold text-navy mb-2">
                  Ready to apply?
                </p>
                <p className="text-sm text-muted mb-4">
                  Skip the inbox — apply directly online and your listing will go
                  live at the 2027 directory launch.
                </p>
                <a
                  href="/apply"
                  className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
                >
                  Apply to be Listed &rarr;
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-6">
                Send a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
