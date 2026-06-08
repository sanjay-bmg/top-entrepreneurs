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

  const industryLines: string[] = data.industries.map(
    (area) => `  ${area}`
  );

  const excludedFeatured = data.excludedFeatured ?? [];
  const topSpotCities = data.featuredPlacement
    ? data.locations.filter((l) => !excludedFeatured.includes(`${l.city}|${l.state}`))
    : [];
  const topSpotLines: string[] = topSpotCities.map(
    (l) => `  ${l.city}, ${l.state}: ${formatCurrency(PRICING.featuredCity)}`,
  );

  const ownersText =
    data.owners && data.owners.length > 0
      ? data.owners
          .map((o) => `\n    • ${o.name}${o.title ? ` (${o.title})` : ""}${o.description ? ` - ${o.description}` : ""}`)
          .join("")
      : "—";

  const divider = "─".repeat(52);
  const pending = "(to be collected)";

  const banner = data.completeLater
    ? `${divider}
⚠️  DETAILS PENDING — ACTION NEEDED
This customer placed their order but chose to COMPLETE THE DETAILS LATER.
Please reach out via the contact email/phone below to collect the rest.
${divider}

`
    : "";

  const categoriesBlock = data.industries.length
    ? `CATEGORIES (${industryCount} ${industryCount > 1 ? "categories" : "category"} × ${cityCount} cit${cityCount > 1 ? "ies" : "y"})
${industryLines.join("\n")}`
    : `CATEGORIES\n  ${pending}`;

  const awardBlock = data.awardShippingAddress
    ? `${data.awardShippingAddress}
${data.awardShippingCity}, ${data.awardShippingState} ${data.awardShippingZip}`
    : `  ${pending}`;

  const text = `
${banner}New listing application received on ${siteConfig.name}

SOURCE
Form Variant:    ${data.variant || "—"}
Order Status:    ${data.completeLater ? "DETAILS PENDING — customer will complete later" : "Complete"}
Traffic Source:  ${meta.referer || "direct"}
Landing Page:    ${meta.landingPage || "/apply"}
Submitted:       ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET

BUSINESS DETAILS
Business Name: ${data.businessName}
Website:       ${data.website || "—"}
Phone:         ${data.businessPhone || pending}
Cities:        ${data.locations.map(l => `${l.city}, ${l.state}`).join(" | ")}
Owners Listed: ${ownersText}
Assets:        ${data.assetPermission === "grant" ? "Permission granted to use website assets" : data.assetPermission === "support" ? "Support team to contact for assets" : pending}

${categoriesBlock}

TOP SPOT (premium — one per city)
${data.featuredPlacement ? (topSpotLines.length > 0 ? topSpotLines.join("\n") : "  Selected, but no cities included") : "  Not selected"}

CONTACT
Name:   ${data.contactFirstName} ${data.contactLastName}${data.contactTitle ? ` (${data.contactTitle})` : ""}
Email:  ${data.email}
Phone:  ${data.contactPhone}

ITEMIZED QUOTE
${divider}
${quote.lineItems.map(li => `${li.label}: ${li.amount === 0 ? "Free" : formatCurrency(li.amount)}`).join("\n")}
${divider}
TOTAL:  ${formatCurrency(quote.total)}
${divider}

NOTES
${data.notes || "—"}

AWARD SHIPPING ADDRESS
${awardBlock}
`.trim();

  await sgMail.send({
    to: recipients(data.email),
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: { email: REPLY_TO, name: FROM_NAME },
    subject: `${data.completeLater ? "[DETAILS PENDING] " : ""}New Application: ${data.businessName} — ${data.locations.map(l => `${l.city}, ${l.state}`).join(" | ")}`,
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
