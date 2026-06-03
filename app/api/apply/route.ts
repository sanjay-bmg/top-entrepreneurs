import { NextRequest, NextResponse } from "next/server";
import { applySchema, contactSchema } from "@/lib/schema";
import { appendLead, appendContact } from "@/lib/sheets";
import { sendLeadEmail, sendContactEmail } from "@/lib/email";
/* Simple in-memory rate limiter: max 5 submissions per IP per minute */
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}

function getMeta(req: NextRequest) {
  return {
    referer: req.headers.get("x-traffic-source") ?? req.headers.get("referer") ?? "Direct",
    landingPage: req.headers.get("x-landing-page") ?? req.headers.get("referer") ?? "",
  };
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const meta = getMeta(req);

  /* Detect submission type */
  const type = typeof body === "object" && body !== null && "type" in body
    ? (body as Record<string, unknown>).type
    : "apply";

  if (type === "contact") {
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid submission.", issues: result.error.flatten() },
        { status: 422 },
      );
    }
    if (result.data._honeypot) {
      return NextResponse.json({ ok: true }); // silently discard
    }
    await appendContact(
      {
        ...result.data,
        phone: result.data.phone ?? "",
      },
      meta,
    ).catch(e => console.error("Sheets contact error:", e));
    await sendContactEmail(result.data, meta).catch(e => console.error("Email contact error:", e));
    return NextResponse.json({ ok: true });
  }

  /* Default: apply */
  const result = applySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid submission.", issues: result.error.flatten() },
      { status: 422 },
    );
  }
  if (result.data._honeypot) {
    return NextResponse.json({ ok: true }); // silently discard
  }

  await appendLead(result.data, meta).catch(e => console.error("Sheets error:", e));
  await sendLeadEmail(result.data, meta).catch(e => console.error("Email error:", e));

  return NextResponse.json({ ok: true });
}
