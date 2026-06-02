import sgMail from "@sendgrid/mail";
import type { ApplyFormData, ContactFormData } from "./schema";
import { calculateQuote, formatCurrency, PRICING } from "./pricing";
import { siteConfig } from "@/site.config";

const {
  fromEmail: FROM_EMAIL,
  fromName: FROM_NAME,
  replyTo: REPLY_TO,
  testEmail: TEST_EMAIL,
  recipients: NOTIFICATION_EMAILS,
} = siteConfig.notifications;

function recipients(submitterEmail: string): string[] {
  return submitterEmail.toLowerCase() === TEST_EMAIL.toLowerCase()
    ? [TEST_EMAIL]
    : [...NOTIFICATION_EMAILS];
}

function isConfigured(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY);
}

function init() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export async function sendLeadEmail(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { businessName: data.businessName });
    return;
  }
  init();

  const quote = calculateQuote({
    industries: data.industries,
    cities: data.locations,
    featured: data.featuredPlacement,
    excludedFeatured: data.excludedFeatured ?? [],
  });

  const cityCount = Math.max(1, data.locations.length);
  const industryCount = data.industries.length;
  const excludedFeatured = data.excludedFeatured ?? [];

  const listingSubtotal = quote.lineItems
    .filter((li) => !li.label.startsWith("Featured listing"))
    .reduce((s, li) => s + li.amount, 0);
  const featuredSubtotal = quote.lineItems
    .filter((li) => li.label.startsWith("Featured listing"))
    .reduce((s, li) => s + li.amount, 0);

  // Per-industry listing detail
  const industryLines: string[] = [];
  data.industries.forEach((area, i) => {
    const rate = i === 0 ? PRICING.primaryIndustry : PRICING.additionalIndustry;
    const label = i === 0 ? "Primary industry " : "Additional industry";
    industryLines.push(
      `  ${label}: ${area.padEnd(34)} ${formatCurrency(rate)} × ${cityCount} cit${cityCount > 1 ? "ies" : "y"} = ${formatCurrency(rate * cityCount)}`
    );
  });

  // Per-city featured detail (one slot per city)
  const featuredLines: string[] = [];
  if (data.featuredPlacement) {
    for (const loc of data.locations) {
      const key = `${loc.city}|${loc.state}`;
      if (!excludedFeatured.includes(key)) {
        featuredLines.push(`  ${loc.city}, ${loc.state}: ${formatCurrency(PRICING.featuredCity)}`);
      }
    }
    for (const key of excludedFeatured) {
      const [city, state] = key.split("|");
      featuredLines.push(`  ${city}, ${state}: [opted out]`);
    }
  }

  const ownersText =
    data.owners && data.owners.length > 0
      ? data.owners
          .map((o) => `\n    • ${o.name}${o.title ? ` (${o.title})` : ""}${o.description ? ` - ${o.description}` : ""}`)
          .join("")
      : "—";

  const divider = "─".repeat(52);

  const text = `
New listing application received on ${siteConfig.name}

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/apply"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

BUSINESS DETAILS
Business Name: ${data.businessName}
Website:       ${data.website || "—"}
Phone:         ${data.businessPhone}
Cities:        ${data.locations.map(l => `${l.city}, ${l.state}`).join(" | ")}
Owners Listed: ${ownersText}
Assets:        ${data.assetPermission === "grant" ? "Permission granted to use website assets" : "Support team to contact for assets"}

INDUSTRIES
${data.industries.map((a, i) => `  ${i === 0 ? "(Primary)   " : "(Additional)"} ${a}`).join("\n")}
Featured Listing: ${data.featuredPlacement ? "Yes" : "No"}

CONTACT
Name:   ${data.contactFirstName} ${data.contactLastName}${data.contactTitle ? ` (${data.contactTitle})` : ""}
Email:  ${data.email}
Phone:  ${data.contactPhone}

ITEMIZED QUOTE
${divider}
LISTING FEES (${industryCount} ${industryCount > 1 ? "industries" : "industry"} × ${cityCount} cit${cityCount > 1 ? "ies" : "y"})
${industryLines.join("\n")}
Listing subtotal:                                    ${formatCurrency(listingSubtotal)}
${data.featuredPlacement && featuredLines.length > 0 ? `
FEATURED LISTING (one per city)
${featuredLines.join("\n")}
Featured subtotal:                                   ${formatCurrency(featuredSubtotal)}
` : data.featuredPlacement ? `
FEATURED LISTING: None selected
` : `
FEATURED LISTING: Not selected
`}${divider}
TOTAL:                                               ${formatCurrency(quote.total)}
${divider}

NOTES
${data.notes || "—"}

AWARD SHIPPING ADDRESS
${data.awardShippingAddress}
${data.awardShippingCity}, ${data.awardShippingState} ${data.awardShippingZip}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `New Application: ${data.businessName} — ${data.locations.map(l => `${l.city}, ${l.state}`).join(" | ")}`,
    text,
  });
}

export async function sendContactEmail(
  data: ContactFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  if (!isConfigured()) {
    console.log("[email] Skipping — SendGrid not configured.", { email: data.email });
    return;
  }
  init();

  const text = `
New inquiry from ${siteConfig.name}

SOURCE
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/contact"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

CONTACT
Name:    ${data.firstName} ${data.lastName}
Email:   ${data.email}
Phone:   ${data.phone || "—"}

Message:
${data.message}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `Contact Inquiry: ${data.firstName} ${data.lastName}`,
    text,
  });
}
