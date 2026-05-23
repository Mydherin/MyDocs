#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
MIC="$ROOT/mic-mydocs"

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/3] Stopping SPA..."
"$DIR/_kill-service.sh" SPA /tmp/mydocs-spa.pid 5175

echo "[2/3] Stopping Spring Boot..."
"$DIR/_kill-service.sh" "Spring Boot" /tmp/mydocs-backend.pid 8080

echo "[3/3] Stopping Postgres and removing volumes..."
docker compose -f "$MIC/docker-compose.yml" down -v

echo "System stopped and volumes removed."
