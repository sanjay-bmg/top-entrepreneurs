# Deployment — Google Cloud Run

Modeled on the toplawfirms setup: container on Cloud Run (port 8080, standalone Next.js
build), **secrets in Secret Manager**, plain config in env vars.

| Item | Value |
|---|---|
| Service | `topentrepreneurs` |
| Region | `us-central1` (default) |
| Image | `gcr.io/<PROJECT_ID>/topentrepreneurs:latest` |
| Secret Manager | `sendgrid-api-key`, `google-service-account-json` |
| Plain env vars | `LEADS_SHEET_ID`, `NEXT_PUBLIC_SITE_URL` |

## Prerequisites (one-time)

1. **GCP project** with billing enabled (note the project ID).
2. **gcloud SDK** installed + authenticated: `gcloud auth login && gcloud config set project <PROJECT_ID>`.
3. **Google service account** (in that project) with a JSON key downloaded to `./service-account.json` (gitignored). No special roles needed for Sheets — access is granted by sharing the sheet.
4. **Google Sheet** with three tabs (headers below), **shared with the service-account email as Editor**.
5. **SendGrid sender verified** — the From address in `site.config.ts` (`listings@topentrepreneurs.com`) must be a verified single sender or on a verified domain, or sends fail.

## Google Sheet structure

The app writes to three tabs (must match exactly — see `lib/sheets.ts`):

- **Applications** (A–Z): Timestamp · Traffic Source · Landing Page · Business Name · Website · Business Phone · Owners to List · Asset Permission · Cities · Industries · Featured Listing · First Name · Last Name · Email · Contact Phone · Title/Role · Notes + Award Shipping · Card Number · Card Expiry · Name on Card · Billing Address · Billing City · Billing State · Billing ZIP · Estimated Total · Pricing Breakdown
- **Contact** (A–H): Timestamp · Traffic Source · Landing Page · First Name · Last Name · Email · Phone · Message
- **Featured-City** (A–E): State · City · Status · Business Name · Timestamp

Row 1 of each tab must be the header row. New rows insert at row 2 (newest on top).
Note: CVV is intentionally **not** collected or stored (PCI).

## Deploy

Edit the config block at the top of `deploy.sh` (`PROJECT_ID`, `LEADS_SHEET_ID`), then:

```bash
./deploy.sh setup     # one-time: enable APIs, create secrets, grant IAM
./deploy.sh deploy    # build via Cloud Build + deploy to Cloud Run
# or both:
./deploy.sh all
```

`setup` reads the SendGrid key from `.env.local` and base64-encodes `./service-account.json`
into Secret Manager, then grants the Cloud Run runtime service account
`roles/secretmanager.secretAccessor`. `deploy` typechecks, builds the image with Cloud Build
(no local Docker), and deploys with the secrets + env wired in.

## Update a secret

```bash
echo -n "SG.new-key" | gcloud secrets versions add sendgrid-api-key --data-file=- --project <PROJECT_ID>
base64 -i new-key.json | tr -d '\n' | gcloud secrets versions add google-service-account-json --data-file=- --project <PROJECT_ID>
```

## Post-deploy verification

1. Open the Cloud Run URL — confirm the site loads.
2. Submit a test from `/apply` (use the `testEmail` in `site.config.ts` so only that address is notified).
3. Confirm: notification email arrives · a row appears at the top of **Applications** · if Featured was selected, a row appears in **Featured-City**.
4. Logs: `gcloud run services logs read topentrepreneurs --region us-central1 --project <PROJECT_ID>`.

## Troubleshooting

- **Email arrives, no sheet row** → Sheet not shared with the SA (Editor), `LEADS_SHEET_ID` mismatch, or a tab renamed. The app logs `[sheets] ...` but never fails the form.
- **Row appears, no email** → SendGrid sender not verified, or bad key. Check `[email]` logs.
- **403 reading secrets** → runtime SA missing `secretmanager.secretAccessor` (re-run `./deploy.sh setup`).
- **Secret names** are lowercase-hyphen: `sendgrid-api-key`, `google-service-account-json`.

## Custom domain

Cloud Run console → add a domain mapping for `topentrepreneurs.com`, update DNS at the
registrar with the records Cloud Run provides; TLS is automatic.
