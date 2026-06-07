"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin, Star, ChevronDown, AlignLeft, Zap,
  Phone, Globe, CheckCircle2, Award, Users, MessageSquare,
} from "lucide-react";
import BrowserFrame from "./BrowserFrame";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { previewBusinesses } from "@/content/previewBusinesses";
import { siteConfig } from "@/site.config";

const D = siteConfig.directory;

type View = "standard" | "spotlight" | "profile";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "xs" | "sm" }) {
  const cls = size === "xs" ? "h-2 w-2" : "h-2.5 w-2.5 sm:h-3 sm:w-3";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

function SiteNav() {
  const { top, bottom, tld } = siteConfig.wordmark;
  return (
    <div className="bg-navy text-white px-3 py-2 sm:px-4 flex items-center gap-4">
      <AlignLeft className="h-4 w-4 text-white md:hidden" />
      <span className="font-display font-bold text-white text-sm whitespace-nowrap">
        <span className="text-gold">{top}</span>{bottom.replace(/ /g, "")}
        <span className="text-white/40 text-xs">{tld}</span>
      </span>
      <div className="hidden sm:flex items-center gap-1 flex-1 max-w-xs bg-white/10 rounded text-[10px] px-2 py-1">
        <MapPin className="h-2.5 w-2.5 text-white/60 flex-shrink-0" />
        <span className="text-white/70 truncate">{D.browse}</span>
      </div>
      <div className="hidden md:flex items-center gap-1 bg-white/10 rounded text-[10px] px-2 py-1">
        <span className="text-white/70">{D.filter}</span>
        <ChevronDown className="h-2.5 w-2.5 text-white/60" />
      </div>
      <button className="ml-auto bg-gold text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
        {D.cta}
      </button>
    </div>
  );
}

function FeaturedCard() {
  const firm = previewBusinesses[0];
  return (
    <div className="mx-2 sm:mx-3 my-2.5 sm:my-3 relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold opacity-40 blur-md pointer-events-none" />

      <div className="relative rounded-xl overflow-hidden border border-gold/30 bg-gradient-to-br from-navy-dark via-navy to-navy-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 pointer-events-none" />

        <div className="flex items-center justify-between bg-gradient-to-r from-gold/20 to-transparent border-b border-gold/20 px-2.5 sm:px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-gold fill-gold" />
            <span className="text-[9px] sm:text-[10px] font-black text-gold uppercase tracking-widest">
              {D.spotName}
            </span>
          </div>
          <span className="text-[7px] sm:text-[8px] font-bold text-gold/80 bg-gold/10 border border-gold/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            Exclusive · {D.spotScope}
          </span>
        </div>

        <div className="flex gap-2.5 sm:gap-3 p-2.5 sm:p-3">
          <div className="relative h-[72px] w-[88px] sm:h-20 sm:w-24 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-gold/50 shadow-lg shadow-gold/20">
            <Image src={firm.imageUrl} alt={firm.name} fill className="object-cover object-top" sizes="96px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] sm:text-xs font-black text-white truncate">{firm.name}</h4>
            <p className="text-[8px] sm:text-[9px] text-gold/70 truncate mt-0.5">{firm.categories.join(" · ")}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={firm.rating} />
              <span className="text-[8px] text-white/40">({firm.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-2 w-2 text-white/30 flex-shrink-0" />
              <span className="text-[8px] text-white/40 truncate">{firm.location}</span>
            </div>
          </div>

          <div className="text-right flex-shrink-0 space-y-1">
            <p className="text-[9px] sm:text-[10px] font-semibold text-gold">{firm.phone}</p>
            <button className="block w-full text-[9px] sm:text-[10px] bg-gradient-to-r from-gold to-gold-dark text-white font-black px-2 py-1 rounded shadow-sm shadow-gold/30">
              View Profile
            </button>
            <button className="block w-full text-[9px] sm:text-[10px] border border-gold/35 text-gold px-2 py-1 rounded font-medium">
              Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectoryContent({ showSpotlight }: { showSpotlight: boolean }) {
  const listedFirms = previewBusinesses.filter((b) => b.rank);
  return (
    <div className="bg-gray-50 h-full">
      <SiteNav />
      <div className="bg-navy/95 px-4 py-3 text-center">
        <p className="text-white text-xs sm:text-sm font-semibold">{D.headline}</p>
        <p className="text-white/50 text-[9px] sm:text-[10px] mt-0.5">{D.browse} · {previewBusinesses.length} listed</p>
      </div>

      {showSpotlight ? (
        <FeaturedCard />
      ) : (
        <div className="m-2 sm:m-3 rounded-lg border border-dashed border-gray-300 bg-white p-3 flex items-center justify-center gap-2">
          <Zap className="h-3 w-3 text-gray-300 flex-shrink-0" />
          <p className="text-[9px] sm:text-[10px] text-gray-400 text-center">
            {D.spotName} available — {D.spotScope} · <span className="text-navy/50 font-semibold">first-come</span>
          </p>
        </div>
      )}

      <div className="px-2 sm:px-3 pb-4 space-y-2">
        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-500 px-1">{D.listHeading}</p>
        {listedFirms.map((firm) => (
          <div key={firm.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-white hover:border-navy/20 transition-colors cursor-pointer">
            <span className="text-xs font-bold text-navy/40 w-4 text-center flex-shrink-0">{firm.rank}</span>
            <div className="relative h-10 w-14 rounded overflow-hidden flex-shrink-0">
              <Image src={firm.imageUrl} alt={firm.name} fill className="object-cover object-top" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-navy truncate">{firm.name}</p>
              <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">{firm.categories.join(" · ")}</p>
              <div className="flex items-center gap-1 mt-0.5"><StarRating rating={firm.rating} /></div>
            </div>
            <button className="text-[9px] sm:text-[10px] bg-navy text-white px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileContent() {
  const firm = previewBusinesses[1];
  return (
    <div className="bg-gray-50 h-full overflow-auto">
      <SiteNav />

      <div className="bg-navy px-3 py-4 sm:px-4">
        <div className="flex gap-3 items-start">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/20">
            <Image src={firm.imageUrl} alt={firm.name} fill className="object-cover object-top" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <h3 className="text-[11px] sm:text-xs font-bold text-white leading-tight">{firm.name}</h3>
              <span className="inline-flex items-center gap-0.5 bg-gold/20 border border-gold/40 text-gold text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                <CheckCircle2 className="h-2 w-2" /> Verified
              </span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <StarRating rating={firm.rating} />
              <span className="text-[9px] text-white/60">{firm.rating} · {firm.reviewCount} reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-white/40 flex-shrink-0" />
              <span className="text-[9px] text-white/60 truncate">{firm.servingArea}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 bg-gold text-white text-[10px] font-bold py-1.5 rounded">
            <Phone className="h-2.5 w-2.5" /> Call Now
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-white/10 border border-white/20 text-white text-[10px] font-semibold py-1.5 rounded">
            <Globe className="h-2.5 w-2.5" /> Website
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-0 p-2 sm:p-3">
        <div className="col-span-2 space-y-2 pr-2">
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{D.servicesLabel}</p>
            {firm.categories.map((cat) => (
              <div key={cat} className="flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-2.5 w-2.5 text-gold flex-shrink-0" />
                <span className="text-[9px] text-gray-600 leading-tight">{cat}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-2 space-y-1.5">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Contact</p>
            <div className="flex items-center gap-1">
              <Phone className="h-2.5 w-2.5 text-navy/50 flex-shrink-0" />
              <span className="text-[9px] text-gray-600 truncate">{firm.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5 text-navy/50 flex-shrink-0" />
              <span className="text-[9px] text-gray-600 truncate">{firm.location}</span>
            </div>
          </div>

          <div className="bg-navy rounded-lg p-2 text-center">
            <Award className="h-4 w-4 text-gold mx-auto mb-1" />
            <p className="text-[8px] font-bold text-white leading-tight">{siteConfig.shortName}</p>
            <p className="text-[7px] text-gold/80">{D.recognition}</p>
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">About</p>
            <p className="text-[9px] text-gray-600 leading-relaxed">{firm.name} is {firm.about}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex items-center gap-1 mb-1.5">
              <Users className="h-2.5 w-2.5 text-gray-400" />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{D.teamLabel}</p>
            </div>
            {firm.team.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 mb-1.5 last:mb-0">
                <div className="h-5 w-5 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[7px] font-bold text-navy">{p.name[0]}</span>
                </div>
                <div>
                  <p className="text-[8px] font-semibold text-gray-700 leading-none">{p.name}</p>
                  <p className="text-[7px] text-gray-400">{p.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-2">
            <div className="flex items-center gap-1 mb-1.5">
              <MessageSquare className="h-2.5 w-2.5 text-gray-400" />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Reviews</p>
            </div>
            <div className="space-y-1.5">
              {firm.reviews.map((r) => (
                <div key={r.author} className="border-l-2 border-gold/30 pl-1.5">
                  <StarRating rating={5} size="xs" />
                  <p className="text-[8px] text-gray-500 mt-0.5 leading-tight">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-[7px] text-gray-400 mt-0.5">— {r.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CALLOUTS: Record<View, { tone: "spot" | "navy"; icon: React.ReactNode; text: React.ReactNode }> = {
  standard: {
    tone: "navy",
    icon: <span className="text-navy text-[10px] font-bold">✓</span>,
    text: <><span className="text-navy font-semibold">Standard Listing</span> — Your {D.noun} appears in the ranked list. Every visitor can click through to your full profile page.</>,
  },
  spotlight: {
    tone: "spot",
    icon: <Zap className="h-4 w-4 text-gold fill-gold" />,
    text: <><span className="text-gold-dark font-semibold">{D.spotName}</span> — Your {D.noun} is pinned as a glowing banner above all ranked listings. Exclusive — {D.spotScope}, first come, first served.</>,
  },
  profile: {
    tone: "navy",
    icon: <span className="text-navy text-[10px] font-bold">★</span>,
    text: <><span className="text-navy font-semibold">Profile Page</span> — Every listing gets a dedicated profile with photo, {D.servicesLabel.toLowerCase()}, {D.teamLabel.toLowerCase()}, reviews, contact details, and your {siteConfig.shortName} badge.</>,
  },
};

export default function DirectoryPreview() {
  const [view, setView] = useState<View>("spotlight");
  const callout = CALLOUTS[view];

  const browserUrl =
    view === "profile"
      ? `${siteConfig.domain}/${D.profileSlug}`
      : `${siteConfig.domain}/${D.directorySlug}`;

  return (
    <section className="bg-cream py-20 lg:py-24 overflow-hidden relative">
      <Container>
        <FadeIn>
          <div className="text-center mb-10 relative z-40">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
              Your Listing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              What Your Listing Looks Like
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              {D.subtext}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border border-cream-dark bg-white p-1 shadow-sm gap-1">
              <button
                onClick={() => setView("spotlight")}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "spotlight"
                    ? "bg-gold text-white shadow-md shadow-gold/30"
                    : "text-muted hover:text-navy"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                {D.toggles.spotlight}
              </button>
              <button
                onClick={() => setView("profile")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "profile" ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
                }`}
              >
                {D.toggles.profile}
              </button>
              <button
                onClick={() => setView("standard")}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  view === "standard" ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
                }`}
              >
                {D.toggles.directory}
              </button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.07}>
          <div className="max-w-4xl mx-auto mb-4">
            <div className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${callout.tone === "spot" ? "bg-gold/5 border-gold/30" : "bg-navy/5 border-navy/15"}`}>
              <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${callout.tone === "spot" ? "bg-gold/15" : "bg-navy/10"}`}>
                {callout.icon}
              </div>
              <p className="text-xs text-muted leading-relaxed">{callout.text}</p>
            </div>
          </div>
        </FadeIn>

        <div className="relative max-w-4xl mx-auto pb-6 sm:pb-12">
          <FadeIn delay={0.1}>
            <div className="shadow-2xl shadow-navy/20 rounded-xl overflow-hidden ring-1 ring-black/5">
              <BrowserFrame url={browserUrl}>
                {view === "profile" ? (
                  <ProfileContent />
                ) : (
                  <DirectoryContent showSpotlight={view === "spotlight"} />
                )}
              </BrowserFrame>
            </div>
          </FadeIn>
        </div>

        <p className="text-center text-sm text-muted mt-8 opacity-80 relative z-40">
          Preview — {siteConfig.name} listings go live{" "}
          <span className="text-gold font-semibold">{D.launch}.</span>
        </p>
      </Container>
    </section>
  );
}
