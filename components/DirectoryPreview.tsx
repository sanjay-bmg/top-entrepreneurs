import Image from "next/image";
import { MapPin, Star, ChevronDown, AlignLeft } from "lucide-react";
import BrowserFrame from "./BrowserFrame";
import Container from "./Container";
import FadeIn from "./FadeIn";
import { previewListings } from "@/content/previewListings";

const PREVIEW_CITY = "Austin, TX";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function FeaturedCard({ compact = false }: { compact?: boolean }) {
  const listing = previewListings[0];
  return (
    <div className="m-2 sm:m-3 rounded-lg border-2 border-amber-400/60 bg-amber-50/40 p-2 sm:p-3 relative">
      <div className="absolute -top-2.5 left-3 flex items-center gap-1">
        <span className="bg-amber-400 text-[9px] sm:text-[10px] font-bold text-navy px-1.5 py-0.5 rounded uppercase tracking-wide">
          Featured
        </span>
        <span className="bg-navy text-[8px] sm:text-[9px] font-bold text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
          Top Rated
        </span>
      </div>
      <div className="flex gap-2 sm:gap-3 mt-1.5 sm:mt-2">
        <div className={`relative ${compact ? "h-14 w-14" : "h-16 w-20"} rounded overflow-hidden flex-shrink-0`}>
          <Image
            src={listing.imageUrl}
            alt={listing.name}
            fill
            className="object-cover object-top"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] sm:text-xs font-bold text-navy truncate">{listing.company}</h4>
          <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
            {listing.name} · {listing.areas.join(" · ")}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={listing.rating} />
            <span className="text-[9px] sm:text-[10px] text-gray-500">
              ({listing.reviewCount} Reviews)
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-gray-400 flex-shrink-0" />
            <span className="text-[8px] sm:text-[9px] text-gray-500 truncate">
              {listing.location}
            </span>
          </div>
        </div>
        {!compact && (
          <div className="text-right flex-shrink-0 space-y-1">
            <p className="text-[10px] font-semibold text-navy">{listing.phone}</p>
            <button className="block w-full text-[10px] bg-navy text-white px-2 py-1 rounded font-medium">
              View Profile
            </button>
            <button className="block w-full text-[10px] border border-navy text-navy px-2 py-1 rounded font-medium">
              Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewContent({ format = "desktop" }: { format?: "desktop" | "tablet" | "mobile" }) {
  const listed = previewListings.filter((l) => l.rank);
  const compact = format === "mobile";

  return (
    <div className="bg-gray-50 h-full">
      {/* Navbar */}
      <div className="bg-navy text-white px-3 py-2 sm:px-4 flex items-center gap-4">
        {compact && <AlignLeft className="h-4 w-4 text-white" />}
        <span className="font-display font-bold text-white text-xs sm:text-sm whitespace-nowrap">
          Top<span className="text-gold">Entrepreneurs</span>
        </span>

        {!compact && (
          <>
            <div className={`flex items-center gap-1 flex-1 max-w-xs bg-white/10 rounded text-[10px] px-2 py-1 ${format === "tablet" ? "hidden" : "hidden sm:flex"}`}>
              <MapPin className="h-2.5 w-2.5 text-white/60 flex-shrink-0" />
              <span className="text-white/70 truncate">{PREVIEW_CITY}</span>
            </div>
            <div className={`items-center gap-1 bg-white/10 rounded text-[10px] px-2 py-1 ${format === "desktop" ? "hidden md:flex" : "hidden"}`}>
              <span className="text-white/70">All Industries</span>
              <ChevronDown className="h-2.5 w-2.5 text-white/60" />
            </div>
            <button className="ml-auto bg-amber-400 text-navy text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
              Get Listed
            </button>
          </>
        )}
      </div>

      {/* Hero bar */}
      <div className="bg-navy/95 px-4 py-3 text-center">
        <p className="text-white text-xs sm:text-sm font-semibold">
          Find Top Entrepreneurs Near You
        </p>
        <p className="text-white/50 text-[9px] sm:text-[10px] mt-0.5">
          {PREVIEW_CITY} · {compact ? "5 businesses" : "5 businesses found"}
        </p>
      </div>

      {/* Featured */}
      <FeaturedCard compact={compact} />

      {/* List */}
      <div className="px-2 sm:px-3 pb-4 space-y-2">
        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-500 px-1">
          Top Entrepreneurs in {PREVIEW_CITY}
        </p>
        {listed.map((listing) => (
          <div
            key={listing.id}
            className={`flex items-center ${compact ? "gap-2 p-2" : "gap-3 p-2.5"} rounded-lg border border-gray-100 bg-white hover:border-amber-200 transition-colors cursor-pointer`}
          >
            <span className="text-xs sm:text-sm font-bold text-navy/40 w-3 sm:w-4 text-center flex-shrink-0">
              {listing.rank}
            </span>
            <div className={`relative ${compact ? "h-8 w-10" : "h-10 w-14"} rounded overflow-hidden flex-shrink-0`}>
              <Image src={listing.imageUrl} alt={listing.name} fill className="object-cover object-top" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-navy truncate">
                {listing.company}
              </p>
              <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">
                {listing.name} · {listing.areas.join(" · ")}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <StarRating rating={listing.rating} />
              </div>
            </div>
            {!compact && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[10px] text-navy font-medium hidden md:block mr-2">
                  {listing.phone}
                </span>
                <button className="text-[9px] sm:text-[10px] bg-navy text-white px-2 py-0.5 rounded whitespace-nowrap">
                  View
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPreview() {
  return (
    <section className="bg-cream py-20 lg:py-24 overflow-hidden relative">
      <Container>
        <FadeIn>
          <div className="text-center mb-16 relative z-40">
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-3">
              Your Listing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-4">
              What Your Listing Looks Like
            </h2>
            <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
            <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              Every listing includes your business name, founder, photo,
              location, category, contact details, and client reviews — with one
              Featured business holding the top spot in each city.
            </p>
          </div>
        </FadeIn>

        <div className="relative max-w-4xl mx-auto pb-6 sm:pb-12">
          <FadeIn delay={0.1}>
            <div className="shadow-2xl shadow-navy/20 rounded-xl overflow-hidden ring-1 ring-black/5">
              <BrowserFrame url="topentrepreneurs.com/austin-tx">
                <PreviewContent format="desktop" />
              </BrowserFrame>
            </div>
          </FadeIn>
        </div>

        <p className="text-center text-sm text-muted mt-8 opacity-80 relative z-40">
          Preview — Top Entrepreneurs listings go live at the{" "}
          <span className="text-gold font-semibold">October 2026 national launch.</span>
        </p>
      </Container>
    </section>
  );
}
