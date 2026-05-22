#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
MIC="$ROOT/mic-mydocs"

echo "[1/3] Stopping SPA..."
if [ -f /tmp/mydocs-spa.pid ]; then
  kill "$(cat /tmp/mydocs-spa.pid)" 2>/dev/null && echo "      Stopped" || echo "      Already stopped"
  rm -f /tmp/mydocs-spa.pid
fi

echo "[2/3] Stopping Spring Boot..."
if [ -f /tmp/mydocs-backend.pid ]; then
  kill "$(cat /tmp/mydocs-backend.pid)" 2>/dev/null && echo "      Stopped" || echo "      Already stopped"
  rm -f /tmp/mydocs-backend.pid
fi

echo "[3/3] Stopping Postgres and removing volumes..."
docker compose -f "$MIC/docker-compose.yml" down -v

echo "System stopped and volumes removed."
