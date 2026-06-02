import { google } from "googleapis";
import type { ApplyFormData } from "./schema";
import type { ContactFormData } from "./schema";
import { calculateQuote, formatCurrency } from "./pricing";
import { getGoogleAuth } from "./google";

/*
 * Applications tab columns (A–Z) — note: CVV is intentionally NOT stored (PCI):
 * A  Timestamp
 * B  Traffic Source (URL)
 * C  Landing Page
 * D  Business Name
 * E  Website
 * F  Business Phone
 * G  Owners to List
 * H  Asset Permission
 * I  Cities (e.g. "Austin, TX; Dallas, TX")
 * J  Industries
 * K  Featured Listing
 * L  First Name
 * M  Last Name
 * N  Email
 * O  Contact Phone
 * P  Title / Role
 * Q  Notes + Award Shipping
 * R  Card Number
 * S  Card Expiry
 * T  Name on Card
 * U  Billing Address
 * V  Billing City
 * W  Billing State
 * X  Billing ZIP
 * Y  Estimated Total
 * Z  Pricing Breakdown
 *
 * Contact tab columns (A–H):
 * A  Timestamp
 * B  Traffic Source (URL)
 * C  Landing Page
 * D  First Name
 * E  Last Name
 * F  Email
 * G  Phone
 * H  Message
 *
 * Featured-City tab columns (A–E) — one row per city that bought the Featured spot:
 * A  State   B  City   C  Status ("active")   D  Business Name   E  Timestamp
 */

const FEATURED_TAB = "Featured-City";

async function getSheets() {
  const auth = getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  const sheetId = process.env.LEADS_SHEET_ID;
  if (!auth || !sheetId) return null;
  const client = await auth.getClient();
  return { sheets: google.sheets({ version: "v4", auth: client as never }), sheetId };
}

/** Insert a row at position 2 (below the header), pushing existing rows down. */
async function insertRowAt2(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  tabName: string,
  tabId: number,
  values: (string | number | boolean)[],
) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: { sheetId: tabId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
            inheritFromBefore: false,
          },
        },
      ],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tabName}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

/** Look up the numeric sheetId for a tab by name. */
async function getTabId(
  sheets: ReturnType<typeof google.sheets>,
  sheetId: string,
  tabName: string,
): Promise<number> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === tabName);
  const tabId = sheet?.properties?.sheetId;
  if (tabId == null) {
    throw new Error(`Tab "${tabName}" not found in sheet`);
  }
  return tabId;
}

export async function appendLead(
  data: ApplyFormData,
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const conn = await getSheets();
  if (!conn) {
    console.log("[sheets] Skipping — credentials not configured.", { businessName: data.businessName });
    return;
  }
  const { sheets, sheetId } = conn;

  let tabId: number;
  try {
    tabId = await getTabId(sheets, sheetId, "Applications");
  } catch (e) {
    console.error("[sheets] Could not find Applications tab:", e);
    return;
  }

  const quote = calculateQuote({
    industries: data.industries,
    cities: data.locations,
    featured: data.featuredPlacement,
    excludedFeatured: data.excludedFeatured ?? [],
  });

  const pricingBreakdown = [
    ...quote.lineItems.map((li) => `${li.label}: ${formatCurrency(li.amount)}`),
    `Total: ${formatCurrency(quote.total)}`,
  ].join(" | ");

  const row = [
    new Date().toISOString(),
    meta.referer || "direct",
    meta.landingPage || "/apply",
    data.businessName,
    data.website ?? "",
    data.businessPhone,
    (() => {
      if (!data.owners || data.owners.length === 0) return "—";
      return data.owners.map(o =>
        `${o.name}${o.title ? ` (${o.title})` : ''}${o.description ? ` - ${o.description}` : ''}`
      ).join('\n');
    })(),
    data.assetPermission === "grant" ? "Permission granted" : "Support team to contact",
    data.locations.map(l => `${l.city}, ${l.state}`).join("; "),
    data.industries.join(", "),
    data.featuredPlacement ? "Yes" : "No",
    data.contactFirstName,
    data.contactLastName,
    data.email,
    data.contactPhone,
    data.contactTitle ?? "",
    (data.notes ? data.notes + "\n\n" : "") +
    `Award Shipping: ${data.awardShippingAddress}, ${data.awardShippingCity}, ${data.awardShippingState} ${data.awardShippingZip}`,
    data.cardNumber,
    data.cardExpiry,
    data.cardName,
    data.billingAddress,
    data.billingCity,
    data.billingState,
    data.billingZip,
    formatCurrency(quote.total),
    pricingBreakdown,
  ];

  await insertRowAt2(sheets, sheetId, "Applications", tabId, row);

  // Write Featured inventory rows (one per included city — one Featured slot per city)
  if (data.featuredPlacement && data.locations.length > 0) {
    const excluded = data.excludedFeatured ?? [];
    const inventoryRows: string[][] = [];
    for (const loc of data.locations) {
      if (!excluded.includes(`${loc.city}|${loc.state}`)) {
        inventoryRows.push([loc.state, loc.city, "active", data.businessName, new Date().toISOString()]);
      }
    }
    if (inventoryRows.length > 0) {
      try {
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: `${FEATURED_TAB}!A:E`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: inventoryRows },
        });
      } catch (e) {
        // Log but don't fail the submission — lead is already recorded
        console.error(`[sheets] Could not write ${FEATURED_TAB} rows:`, e);
      }
    }
  }
}

export async function appendContact(
  data: ContactFormData & { phone?: string },
  meta: { referer: string; landingPage: string },
): Promise<void> {
  const conn = await getSheets();
  if (!conn) {
    console.log("[sheets] Skipping — credentials not configured.", { email: data.email });
    return;
  }
  const { sheets, sheetId } = conn;

  let tabId: number;
  try {
    tabId = await getTabId(sheets, sheetId, "Contact");
  } catch (e) {
    console.error("[sheets] Could not find Contact tab:", e);
    return;
  }

  const row = [
    new Date().toISOString(),
    meta.referer || "direct",
    meta.landingPage || "/contact",
    data.firstName,
    data.lastName,
    data.email,
    data.phone ?? "",
    data.message,
  ];

  await insertRowAt2(sheets, sheetId, "Contact", tabId, row);
}
