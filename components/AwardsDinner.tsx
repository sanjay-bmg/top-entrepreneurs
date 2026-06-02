import { Award, Calendar, Phone, Star, Users } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { LaurelLeft, LaurelRight } from "./LaurelWreath";
import { siteConfig } from "@/site.config";

export default function AwardsDinner() {
  return (
    <section className="bg-navy py-20 lg:py-28 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent pointer-events-none" />

      <Container>
        {/* Centered header with flanking laurels */}
        <FadeIn>
          <div className="text-center mb-14 lg:mb-16">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-5">
              Celebrate. Connect. Be Recognized.
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-8">
              <LaurelLeft className="h-20 w-9 sm:h-28 sm:w-12 lg:h-36 lg:w-16 text-gold/60 flex-shrink-0" />
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Annual Awards &amp;
                <br />
                <span className="text-gold">Recognition Dinner</span>
              </h2>
              <LaurelRight className="h-20 w-9 sm:h-28 sm:w-12 lg:h-36 lg:w-16 text-gold/60 flex-shrink-0" />
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: award emblem */}
          <FadeIn direction="left">
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-72 sm:w-80">
                <div className="absolute -inset-6 bg-gold/10 rounded-3xl blur-2xl" />

                {/* Floating banner */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 justify-center px-4 py-1.5 bg-gold text-white font-bold text-[10px] tracking-widest uppercase rounded-full shadow-md whitespace-nowrap">
                  Limited Time: Apply Today
                </div>

                <div className="relative aspect-[4/5] w-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-navy-light to-navy-dark border border-gold/30 flex flex-col items-center justify-center text-center px-8">
                  <p className="text-[11px] font-semibold text-gold uppercase tracking-[0.3em] mb-5">
                    Top Entrepreneurs
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <LaurelLeft className="h-20 w-9 text-gold flex-shrink-0" />
                    <div className="flex flex-col items-center">
                      <Star className="h-7 w-7 text-gold fill-gold mb-1.5" />
                      <span className="font-display text-4xl font-bold text-white leading-none">
                        2027
                      </span>
                    </div>
                    <LaurelRight className="h-20 w-9 text-gold flex-shrink-0" />
                  </div>
                  <p className="font-display text-lg font-semibold text-white">
                    Recognition Award
                  </p>
                  <div className="w-10 h-0.5 bg-gold/60 my-4" />
                  <p className="text-white/55 text-[11px] tracking-widest uppercase">
                    Excellence in Entrepreneurship
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: details */}
          <FadeIn direction="right" delay={0.15}>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Every listed entrepreneur receives a custom recognition award and
              an invitation to the Annual Awards &amp; Recognition Dinner — a
              night of peer recognition, networking, and celebration of the
              founders and owners featured on {siteConfig.name}.
            </p>

            <div className="space-y-4 mb-10">
              {[
                {
                  icon: Award,
                  text: "Limited time: complimentary custom recognition award with your application",
                },
                {
                  icon: Calendar,
                  text: "Exclusive annual dinner event for listed entrepreneurs",
                },
                {
                  icon: Users,
                  text: "Network with peers, investors, and community leaders",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mt-0.5">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button href="/how-it-works" variant="outline-gold" size="lg">
                Learn More
              </Button>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-colors"
              >
                <Phone className="h-4 w-4 text-gold" />
                {siteConfig.phone}
              </a>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
