#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
MIC="$ROOT/mic-mydocs"

echo "=== Postgres ==="
docker compose -f "$MIC/docker-compose.yml" ps

echo ""
echo "=== Spring Boot ==="
if [ -f /tmp/mydocs-backend.pid ] && kill -0 "$(cat /tmp/mydocs-backend.pid)" 2>/dev/null; then
  echo "  RUNNING  PID $(cat /tmp/mydocs-backend.pid) | http://localhost:8080"
else
  echo "  STOPPED"
fi

echo ""
echo "=== SPA ==="
if [ -f /tmp/mydocs-spa.pid ] && kill -0 "$(cat /tmp/mydocs-spa.pid)" 2>/dev/null; then
  echo "  RUNNING  PID $(cat /tmp/mydocs-spa.pid) | http://localhost:5175"
else
  echo "  STOPPED"
fi
