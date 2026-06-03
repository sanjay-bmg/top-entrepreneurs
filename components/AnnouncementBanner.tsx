import { Phone, Sparkles } from "lucide-react";
import Container from "./Container";
import { siteConfig } from "@/site.config";

export default function AnnouncementBanner() {
  return (
    <section className="bg-navy-dark border-y border-gold/20 py-8">
      <Container>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 border border-gold/30">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-white">
              Applications Are Now Open for the 2027 Directory.
            </p>
            <p className="text-white/60 text-sm mt-0.5">
              {siteConfig.name} recognizes the founders and owners building
              standout businesses across the country. Listed across every
              recognition category — all included.
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto hidden sm:flex items-center gap-3">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/20 hover:border-gold/60 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
