// Initialize + format the Google Sheet for Top Entrepreneurs:
// creates the Applications / Contact / Featured-City tabs with headers,
// freezes + styles the header row (Applications is color-coded into sections),
// sets tab colors, auto-sizes columns, and removes the default Sheet1.
//
// Prereq: ./service-account.json present, LEADS_SHEET_ID in .env.local,
//         Sheet shared with the service-account email (Editor).
// Run:    node scripts/init-sheet.mjs
import { google } from "googleapis";
import fs from "node:fs";

const HEADERS = {
  Applications: [
    "Timestamp", "Traffic Source", "Landing Page", "Business Name", "Website",
    "Business Phone", "Owners to List", "Asset Permission", "Cities", "Industries",
    "Featured Listing", "First Name", "Last Name", "Email", "Contact Phone",
    "Title / Role", "Notes + Award Shipping", "Card Number", "Card Expiry",
    "Name on Card", "Billing Address", "Billing City", "Billing State",
    "Billing ZIP", "Estimated Total", "Pricing Breakdown",
  ],
  Contact: [
    "Timestamp", "Traffic Source", "Landing Page", "First Name", "Last Name",
    "Email", "Phone", "Message",
  ],
  "Featured-City": ["State", "City", "Status", "Business Name", "Timestamp"],
};

// Color-coded sections for the Applications header (start/end are 0-indexed, end inclusive)
const rgb = (r, g, b) => ({ red: r / 255, green: g / 255, blue: b / 255 });
const WHITE = rgb(255, 255, 255);
const CHARCOAL = rgb(31, 41, 55);
const EMERALD = rgb(31, 122, 90);
const SECTIONS = [
  { from: 0, to: 2, color: rgb(71, 85, 105) },    // Source     — slate
  { from: 3, to: 7, color: rgb(21, 24, 29) },     // Business   — charcoal
  { from: 8, to: 10, color: rgb(31, 122, 90) },   // Listing    — emerald
  { from: 11, to: 16, color: rgb(55, 48, 163) },  // Contact    — indigo
  { from: 17, to: 23, color: rgb(146, 64, 14) },  // Billing    — amber
  { from: 24, to: 25, color: rgb(15, 118, 110) }, // Quote      — teal
];

const env = fs.readFileSync(".env.local", "utf8");
const sheetId = (env.match(/^LEADS_SHEET_ID=(.+)$/m) || [])[1]?.trim() || process.env.LEADS_SHEET_ID;
if (!sheetId) { console.error("✗ LEADS_SHEET_ID not set"); process.exit(1); }
if (!fs.existsSync("./service-account.json")) { console.error("✗ ./service-account.json not found"); process.exit(1); }

const credentials = JSON.parse(fs.readFileSync("./service-account.json", "utf8"));
const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

const headerCell = (bg) => ({
  userEnteredFormat: {
    backgroundColor: bg,
    horizontalAlignment: "CENTER",
    verticalAlignment: "MIDDLE",
    textFormat: { bold: true, foregroundColor: WHITE, fontSize: 10 },
    wrapStrategy: "CLIP",
  },
});
const HEADER_FIELDS = "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat,wrapStrategy)";

// 1) Ensure tabs exist
let meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
let byTitle = Object.fromEntries((meta.data.sheets || []).map((s) => [s.properties.title, s.properties]));
const addReqs = Object.keys(HEADERS).filter((t) => !byTitle[t]).map((t) => ({ addSheet: { properties: { title: t } } }));
if (addReqs.length) {
  await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests: addReqs } });
  console.log("Added tabs:", addReqs.map((r) => r.addSheet.properties.title).join(", "));
}

// 2) Write headers
for (const [title, headers] of Object.entries(HEADERS)) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId, range: `${title}!A1`, valueInputOption: "RAW", requestBody: { values: [headers] },
  });
}

// 3) Re-fetch for sheetIds, then format
meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
byTitle = Object.fromEntries((meta.data.sheets || []).map((s) => [s.properties.title, s.properties]));

const requests = [];
if (byTitle["Sheet1"]) requests.push({ deleteSheet: { sheetId: byTitle["Sheet1"].sheetId } });

for (const [title, headers] of Object.entries(HEADERS)) {
  const sid = byTitle[title].sheetId;
  const ncols = headers.length;
  requests.push(
    { updateSheetProperties: { properties: { sheetId: sid, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
    { updateSheetProperties: { properties: { sheetId: sid, tabColor: EMERALD }, fields: "tabColor" } },
    { autoResizeDimensions: { dimensions: { sheetId: sid, dimension: "COLUMNS", startIndex: 0, endIndex: ncols } } },
  );
  if (title === "Applications") {
    for (const s of SECTIONS) {
      requests.push({
        repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: s.from, endColumnIndex: s.to + 1 }, cell: headerCell(s.color), fields: HEADER_FIELDS },
      });
    }
  } else {
    requests.push({
      repeatCell: { range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: ncols }, cell: headerCell(CHARCOAL), fields: HEADER_FIELDS },
    });
  }
}

await sheets.spreadsheets.batchUpdate({ spreadsheetId: sheetId, requestBody: { requests } });
console.log("✓ Tabs ready + formatted (frozen bold headers, Applications section colors, tab colors, auto-sized, Sheet1 removed).");
console.log(`  Shared with: ${credentials.client_email}`);
