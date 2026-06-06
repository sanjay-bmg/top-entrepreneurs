import { Globe, Megaphone, Bot, TrendingUp } from "lucide-react";
import Container from "./Container";
import FadeIn from "./FadeIn";

const MEDIA_LOGOS = [
  { src: "/logos/ap.svg",          alt: "AP News",    h: "h-9"  },
  { src: "/logos/google-news.svg", alt: "Google News", h: "h-10" },
  { src: "/logos/usa-today.svg",   alt: "USA TODAY",   h: "h-5"  },
  { src: "/logos/nbc.svg",         alt: "NBC",         h: "h-10" },
  { src: "/logos/fox-news.svg",    alt: "FOX News",    h: "h-10" },
  { src: "/logos/abc.svg",         alt: "ABC",         h: "h-9"  },
  { src: "/logos/cbs.svg",         alt: "CBS",         h: "h-6"  },
];

const features = [
  {
    icon: Globe,
    heading: "Nationwide Media Reach",
    body: "Your business gets featured on Google News, AP News, the USA TODAY Network, and 100+ NBC, FOX, ABC & CBS local affiliates across the country.",
  },
  {
    icon: Megaphone,
    heading: "Journalists & Media Influencers",
    body: "Your story lands directly in the feeds of reporters, editors, and media influencers actively looking for businesses to cover.",
  },
  {
    icon: Bot,
    heading: "AI & Large Language Models",
    body: "Your listing is indexed by the AI tools your customers already use — ChatGPT, Claude, Gemini, and the next generation of AI-powered search.",
  },
  {
    icon: TrendingUp,
    heading: "SEO & Long-Term Discoverability",
    body: "Media placements build high-authority backlinks and lasting search visibility that compounds over time — long after the initial announcement.",
  },
];

export default function MediaVisibility() {
  return (
    <section className="bg-cream py-20 lg:py-24">
      <Container>
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
              Included With Your Listing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              Your Story, Amplified Everywhere
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
            <p className="text-muted max-w-xl mx-auto text-lg leading-relaxed">
              Every listing includes a national media announcement distributed across major media
              networks, giving your business national exposure and lasting digital presence.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map(({ icon: Icon, heading, body }, i) => (
            <FadeIn key={heading} delay={i * 0.07}>
              <div className="rounded-xl border border-cream-dark bg-white p-6 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/20 mb-4">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-display text-base font-semibold text-navy mb-2">
                  {heading}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Media logo strip */}
        <FadeIn delay={0.3}>
          <div className="mt-14 max-w-4xl mx-auto">
            <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-8">
              Get featured on
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {MEDIA_LOGOS.map(({ src, alt, h }) => (
                <div key={alt} className={`relative ${h} w-auto transition-transform duration-200 hover:scale-125`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className={`${h} w-auto object-contain`} />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
