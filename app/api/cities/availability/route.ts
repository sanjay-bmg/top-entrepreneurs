import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getCache, setCache } from "@/lib/availabilityCache";
import { getGoogleAuth } from "@/lib/google";

/*
 * GET /api/cities/availability?city=Austin&state=TX
 *
 * Returns whether this city's single Featured listing is already taken.
 * Reads the "Featured-City" sheet tab.
 *
 * Sheet columns: state | city | status | business_name | timestamp
 * A row is "taken" when status === "active".
 *
 * Response: { featuredTaken: boolean }
 */

const TAB = "Featured-City";

async function getTakenCities(): Promise<{ state: string; city: string }[]> {
  const cached = getCache();
  if (cached) return cached.data;

  const auth = getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
  const sheetId = process.env.LEADS_SHEET_ID;
  if (!auth || !sheetId) return [];

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as never });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${TAB}!A2:C`,
  });

  const rows = res.data.values ?? [];
  // Columns: A=state, B=city, C=status
  const taken = rows
    .filter((r) => r[2]?.toString().toLowerCase() === "active")
    .map((r) => ({
      state: (r[0] ?? "").toString().trim(),
      city: (r[1] ?? "").toString().trim(),
    }));

  setCache(taken);
  return taken;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim() ?? "";
  const state = searchParams.get("state")?.trim() ?? "";

  if (!city || !state) {
    return NextResponse.json({ featuredTaken: false });
  }

  try {
    const taken = await getTakenCities();
    const featuredTaken = taken.some(
      (t) =>
        t.state.toLowerCase() === state.toLowerCase() &&
        t.city.toLowerCase() === city.toLowerCase(),
    );
    return NextResponse.json({ featuredTaken });
  } catch (err) {
    console.error("[availability] Sheet read failed:", err);
    // Fail open — don't block the form if the sheet is unreachable
    return NextResponse.json({ featuredTaken: false });
  }
}
