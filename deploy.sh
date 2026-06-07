#!/usr/bin/env bash
#
# Deploy Top Entrepreneurs to Google Cloud Run (source deploy + Secret Manager).
# Secrets live in Secret Manager; non-secret config in .gcloud-env.yaml.
#
#   ./deploy.sh setup     one-time: enable APIs, create secrets, grant IAM
#   ./deploy.sh deploy    gcloud run deploy --source .  (builds from the Dockerfile)
#   ./deploy.sh all       setup then deploy
#
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-bigswing}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-topentrepreneurs}"
SA_KEY_FILE="${SA_KEY_FILE:-./service-account.json}"
# Secrets are namespaced so they don't collide in a shared project.
SECRET_SENDGRID="topentrepreneurs-sendgrid-api-key"
SECRET_GOOGLE="topentrepreneurs-google-sa-json"

setup() {
  echo "→ Enabling APIs..."
  gcloud services enable run.googleapis.com cloudbuild.googleapis.com \
    secretmanager.googleapis.com artifactregistry.googleapis.com sheets.googleapis.com \
    --project "$PROJECT_ID"

  echo "→ SendGrid secret (from .env.local)..."
  local sg; sg=$(grep -E '^SENDGRID_API_KEY=' .env.local | cut -d= -f2-)
  if gcloud secrets describe "$SECRET_SENDGRID" --project "$PROJECT_ID" >/dev/null 2>&1; then
    printf '%s' "$sg" | gcloud secrets versions add "$SECRET_SENDGRID" --data-file=- --project "$PROJECT_ID"
  else
    printf '%s' "$sg" | gcloud secrets create "$SECRET_SENDGRID" --data-file=- --project "$PROJECT_ID"
  fi

  if [ -f "$SA_KEY_FILE" ]; then
    echo "→ Google service-account secret (base64)..."
    local b64; b64=$(base64 -i "$SA_KEY_FILE" | tr -d '\n')
    if gcloud secrets describe "$SECRET_GOOGLE" --project "$PROJECT_ID" >/dev/null 2>&1; then
      printf '%s' "$b64" | gcloud secrets versions add "$SECRET_GOOGLE" --data-file=- --project "$PROJECT_ID"
    else
      printf '%s' "$b64" | gcloud secrets create "$SECRET_GOOGLE" --data-file=- --project "$PROJECT_ID"
    fi
  else
    echo "⚠ $SA_KEY_FILE not found — skipping Google secret (Sheets logging stays off until added)."
  fi

  echo "→ Granting Cloud Run runtime SA secretAccessor..."
  local num; num=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${num}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" >/dev/null
  echo "✓ setup done"
}

deploy() {
  echo "→ Typecheck..."
  npx tsc --noEmit
  local secrets="SENDGRID_API_KEY=${SECRET_SENDGRID}:latest"
  if gcloud secrets describe "$SECRET_GOOGLE" --project "$PROJECT_ID" >/dev/null 2>&1; then
    secrets="${secrets},GOOGLE_SERVICE_ACCOUNT_JSON=${SECRET_GOOGLE}:latest"
  fi
  echo "→ Deploying (source build)..."
  gcloud run deploy "$SERVICE" \
    --source . \
    --project "$PROJECT_ID" \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 5 \
    --concurrency 80 \
    --set-secrets "$secrets" \
    --env-vars-file .gcloud-env.yaml
  echo "✓ Deployed:"
  gcloud run services describe "$SERVICE" --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)'
}

case "${1:-}" in
  setup)  setup ;;
  deploy) deploy ;;
  all)    setup; deploy ;;
  *) echo "Usage: $0 {setup|deploy|all}"; exit 1 ;;
esac
