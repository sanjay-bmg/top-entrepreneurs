import Image from "next/image";
import { Star } from "lucide-react";
import Button from "./Button";
import Container from "./Container";
import FadeIn from "./FadeIn";
import LaurelWreath from "./LaurelWreath";

export default function Hero() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background city image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80"
          alt=""
          fill
          className="object-cover object-center opacity-[0.22]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
      </div>

      {/* Subtle accent */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent pointer-events-none" />

      <Container>
        <div className="relative py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: headline */}
          <FadeIn direction="left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 mb-6">
              <Star className="h-3.5 w-3.5 text-gold fill-gold" />
              <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                Applications Open — 2027 Listings
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Now Accepting{" "}
              <span className="text-gold">2027</span>
              <br />
              Top Entrepreneur
              <br />
              Applications.
            </h1>

            <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              TopEntrepreneurs.com is where the nation&apos;s founders and
              business owners earn recognition and get discovered. Tell us about
              your business and the people who built it — and claim your place
              among your city&apos;s most recognized entrepreneurs.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="/apply" variant="primary" size="lg">
                Tell Us About Your Business
              </Button>
              <Button href="/how-it-works" variant="outline-light" size="lg">
                Learn More
              </Button>
            </div>
          </FadeIn>

          {/* Right: founder portrait showcase */}
          <FadeIn direction="right" delay={0.15}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md mt-10 lg:mt-0">
                <div className="absolute -inset-4 bg-gold/10 rounded-3xl blur-2xl z-0" />

                {/* Background Laurel Wreath peeking behind the card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-auto opacity-30 pointer-events-none z-0">
                  <LaurelWreath className="w-full text-gold" />
                </div>

                <div className="relative rounded-2xl border border-gold/20 bg-navy shadow-2xl overflow-hidden group z-10">
                  <div className="relative h-[480px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                      alt="A recognized founder"
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                      Highlight the vision, milestones, and grit of the founders
                      who built your business.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-white"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
