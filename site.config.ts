/**
 * Central site configuration.
 *
 * Single source of truth for brand identity, contact info, analytics, and
 * navigation. Edit values here instead of hunting through components.
 * Items marked PLACEHOLDER are pending input (Tim / Suneet) — see docs.
 *
 * Note on design tokens: colors live in app/globals.css (@theme). The token
 * names are kept generic — "navy" = primary dark, "gold" = accent — so a
 * reskin is a hex swap there, not a rename across components.
 */

export interface NavLink {
  href: string;
  label: string;
}

export const siteConfig = {
  // Identity
  name: "TopEntrepreneurs.com",
  shortName: "Top Entrepreneurs",
  legalEntity: "TopEntrepreneurs.com",
  domain: "topentrepreneurs.com",
  url: "https://topentrepreneurs.com",
  launchYear: 2026,

  // Wordmark — the logo is rendered as styled text (see components/Wordmark.tsx)
  wordmark: { top: "TOP", bottom: "ENTREPRENEURS", tld: ".com" },

  // SEO / social
  title: "TopEntrepreneurs.com — Recognizing the Builders Behind America's Businesses",
  description:
    "TopEntrepreneurs.com is the premier recognition directory for founders and business owners. Apply to be listed, claim your city's single Featured spot, and earn recognition at our Annual Awards & Recognition Dinner.",
  ogDescription:
    "Get listed on TopEntrepreneurs.com. Gain visibility, earn recognition, and claim the one Featured listing in your city.",

  // Contact — PLACEHOLDERS pending CTM number (Tim) and inbox setup
  phone: "(855) 230-9100",
  phoneHref: "tel:+18552309100",
  salesEmail: "listings@topentrepreneurs.com",

  // Analytics — PLACEHOLDER GA4 id (Suneet / Tim)
  gaMeasurementId: "G-XXXXXXXXXX",

  // Lead notification email — PLACEHOLDERS (the "standard email list")
  // SENDGRID_API_KEY + sender verification handled via env / SendGrid dashboard.
  notifications: {
    // Verified SendGrid single sender (no domain auth needed).
    // Switch to listings@topentrepreneurs.com once the domain CNAMEs are added.
    fromEmail: "sbansal@brianmarketinggroup.com",
    fromName: "Top Entrepreneurs",
    replyTo: "sbansal@brianmarketinggroup.com",
    // When the submitter uses this email, only it receives the notification (test mode).
    testEmail: "sbansal@brianmarketinggroup.com",
    recipients: [
      "sbansal@brianmarketinggroup.com",
    ],
  },

  // Traffic-source attribution cookie name
  trafficCookie: "te_source",

  // "What Your Listing Looks Like" directory preview (components/DirectoryPreview.tsx)
  directory: {
    subtext:
      "Every listing includes a ranked directory placement, a dedicated profile page, and an optional Top Spot banner. Switch between the views below.",
    browse: "Austin, TX",
    filter: "All Categories",
    cta: "Get Listed",
    headline: "Find Top Entrepreneurs Near You",
    listHeading: "Top Businesses in Austin, TX",
    spotName: "Top Spot",
    spotScope: "1 per city",
    servicesLabel: "Categories",
    teamLabel: "Founders",
    noun: "business",
    recognition: "2027 Recognized",
    launch: "October 2026",
    toggles: { spotlight: "Top Spot", profile: "Profile", directory: "Directory" },
    directorySlug: "austin-tx",
    profileSlug: "verdant-foods-co",
  },

  // Navigation
  nav: [
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/industries", label: "Categories" },
    { href: "/contact", label: "Contact" },
  ] as NavLink[],

  footer: {
    company: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
    ] as NavLink[],
    forMembers: [
      { href: "/apply", label: "Apply to be Listed" },
      { href: "/how-it-works", label: "Benefits of Listing" },
      { href: "/how-it-works", label: "Recognition Process" },
      { href: "/how-it-works", label: "Awards & Dinner" },
    ] as NavLink[],
  },
} as const;

export type SiteConfig = typeof siteConfig;
