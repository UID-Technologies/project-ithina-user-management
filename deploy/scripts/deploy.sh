#!/usr/bin/env bash
# Build and start all containers on the VM (MongoDB + API + SmartSave).
#
# Usage (from repo root after git clone):
#   cp deploy/.env.example deploy/.env
#   # Edit deploy/.env — set PUBLIC_HOST, JWT_SECRET, VITE_API_BASE_URL, CORS_ORIGIN
#   chmod +x deploy/scripts/deploy.sh
#   ./deploy/scripts/deploy.sh           # build + start
#   ./deploy/scripts/deploy.sh --seed    # also load demo data
#   ./deploy/scripts/deploy.sh --down    # stop stack

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="deploy/docker-compose.yml"
ENV_FILE="deploy/.env"
SEED=false
DOWN=false

for arg in "$@"; do
  case "$arg" in
    --seed) SEED=true ;;
    --down) DOWN=true ;;
    -h|--help)
      echo "Usage: $0 [--seed] [--down]"
      exit 0
      ;;
  esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy deploy/.env.example and configure PUBLIC_HOST + JWT_SECRET."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ "${PUBLIC_HOST:-}" == "YOUR_VM_PUBLIC_IP_OR_DOMAIN" ]] || [[ -z "${PUBLIC_HOST:-}" ]]; then
  echo "Set PUBLIC_HOST in deploy/.env to your VM public IP or domain."
  exit 1
fi

if [[ "${JWT_SECRET:-}" == "change-me-to-a-long-random-secret-at-least-32-chars" ]] || [[ ${#JWT_SECRET} -lt 32 ]]; then
  echo "Set a strong JWT_SECRET (32+ chars) in deploy/.env before deploying."
  exit 1
fi

# Keep browser-facing URLs in sync with PUBLIC_HOST when placeholders remain
if grep -q "YOUR_VM_PUBLIC_IP_OR_DOMAIN" "$ENV_FILE"; then
  sed -i "s|YOUR_VM_PUBLIC_IP_OR_DOMAIN|${PUBLIC_HOST}|g" "$ENV_FILE"
  echo "Updated deploy/.env URLs to use PUBLIC_HOST=${PUBLIC_HOST}"
fi

export VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://${PUBLIC_HOST}:${API_PORT:-3002}}"
export CORS_ORIGIN="${CORS_ORIGIN:-http://${PUBLIC_HOST}:${WEB_PORT:-8080}}"

if $DOWN; then
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
  echo "Stack stopped."
  exit 0
fi

echo "Building and starting containers (mongo, api, smartsave)…"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo "Waiting for API health…"
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${API_PORT:-3002}/health" >/dev/null 2>&1; then
    echo "API is healthy."
    break
  fi
  sleep 2
  if [[ $i -eq 30 ]]; then
    echo "API did not become healthy in time. Check: docker compose -f $COMPOSE_FILE logs api"
    exit 1
  fi
done

if $SEED; then
  echo "Seeding demo data…"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile seed run --rm seed
  echo "Seed complete."
fi

echo ""
echo "Deployment ready:"
echo "  Frontend:  http://${PUBLIC_HOST}:${WEB_PORT:-8080}/superadmin/login"
echo "  API:       http://${PUBLIC_HOST}:${API_PORT:-3002}/health"
echo "  Swagger:   http://${PUBLIC_HOST}:${API_PORT:-3002}/api/docs"
echo ""
echo "Ensure Azure NSG allows inbound TCP ${WEB_PORT:-8080} and ${API_PORT:-3002}."
