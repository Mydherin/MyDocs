#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
MIC="$ROOT/mic-mydocs"
SPA="$ROOT/spa-mydocs"

echo "[1/3] Starting Postgres..."
docker compose -f "$MIC/docker-compose.yml" up -d

echo "[2/3] Starting Spring Boot..."
nohup "$MIC/mvnw" -f "$MIC/pom.xml" spring-boot:run > /tmp/mydocs-backend.log 2>&1 &
echo $! > /tmp/mydocs-backend.pid
echo "      PID $(cat /tmp/mydocs-backend.pid) — logs: /tmp/mydocs-backend.log"

echo "[3/3] Starting SPA..."
(cd "$SPA" && nohup bun run dev > /tmp/mydocs-spa.log 2>&1) &
echo $! > /tmp/mydocs-spa.pid
echo "      PID $(cat /tmp/mydocs-spa.pid) — logs: /tmp/mydocs-spa.log"

echo ""
echo "Waiting for services to be ready..."

# Wait for Spring Boot (any HTTP response means it's up)
for i in $(seq 1 60); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null | grep -qE "^[0-9]{3}$"; then
    echo "  Spring Boot: READY"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "  Spring Boot: TIMEOUT — check /tmp/mydocs-backend.log"
  fi
  sleep 2
done

# Wait for SPA
for i in $(seq 1 30); do
  if curl -sf http://localhost:5175 > /dev/null 2>&1; then
    echo "  SPA:         READY"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  SPA:         TIMEOUT — check /tmp/mydocs-spa.log"
  fi
  sleep 1
done

echo ""
echo "System up. Backend: http://localhost:8080 | SPA: http://localhost:5175"
