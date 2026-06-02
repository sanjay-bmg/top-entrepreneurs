# TopEntrepreneurs.com

Marketing + lead-capture site for an award/recognition directory of entrepreneurs
and business owners. Built from the TopLawFirms.com template and adapted for this
brand (see `../../toplawfirms-analysis.md` for the original analysis).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 (`@theme`, no JS config) ·
react-hook-form + zod · Framer Motion · Google Sheets + SendGrid · Docker → Cloud Run.
Node 22, pnpm 10.

## Quick start

```bash
nvm use          # Node 22 (.nvmrc)
pnpm install
cp .env.example .env.local   # fill in values (optional for local — see below)
pnpm dev         # http://localhost:3000
```

The site runs **without credentials** — `lib/sheets.ts` and `lib/email.ts` no-op
with a log line when env vars are missing, so local dev needs no secrets.

## Configure the whole site in one file: `site.config.ts`

Brand name, domain, phone, sales email, GA4 measurement ID, nav/footer links, and
lead-notification recipients all live in `site.config.ts`. This is the first place
to edit for a new site or a value change.

## Design tokens (reskin)

Colors and fonts are in `app/globals.css` under `@theme`. Token names are
**role-based**, so a reskin is a hex swap with no component changes:

- `navy` = primary dark → charcoal `#15181D`
- `gold` = accent → emerald `#1F7A5A`
- Fonts: **Lora** (display) + **Inter** (body)

## Domain model

- **Pricing** (`lib/pricing.ts`, placeholders): first industry **$199**, each
  additional **$59** — per industry, per city. **Featured listing $499/yr**.
- **Featured = one per city** (the scarcity hook). Inventory is tracked in the
  `Featured-City` sheet tab; the apply form checks `/api/cities/availability`
  (`{ featuredTaken }`) and disables a city whose spot is taken. Free a slot by
  deleting its row.
- **Content**: `content/industries.ts` (18), `content/faq.ts`,
  `content/previewListings.ts`, `content/cities.ts`, `content/states.ts`.
- **Forms**: `ApplyForm` (4-step Order) and `ContactForm` (Get More Information).
  Schema in `lib/schema.ts`. **CVV is intentionally not collected or stored (PCI).**

## Google Sheet tabs

- **Applications** — 26 cols A–Z (see header comment in `lib/sheets.ts`)
- **Contact** — 8 cols A–H
- **Featured-City** — `state | city | status | business | timestamp`

Share the sheet with the service account as **Editor**.

## Placeholders to finalize before launch

- `site.config.ts`: phone (CTM number from Tim), GA4 id, notification recipients, sales email
- `.env.local` / Cloud Run: `GOOGLE_SERVICE_ACCOUNT_JSON`, `LEADS_SHEET_ID`, `SENDGRID_API_KEY`
- Real logo (currently a text wordmark, `components/Wordmark.tsx`) and favicon (`app/icon.svg` placeholder)
- Legal review of Privacy & Terms (governing law currently set to Florida, carried over)
- Confirm final pricing numbers

## Deploy

Docker standalone → Google Cloud Run (port 8080). `pnpm build` produces the
standalone bundle. Set env vars + SendGrid/Google secrets, then map the domain.
