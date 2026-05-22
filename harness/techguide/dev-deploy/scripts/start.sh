#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
MIC="$ROOT/mic-mydocs"
SPA="$ROOT/spa-mydocs"

echo "[1/3] Starting Postgres..."
docker compose -f "$MIC/docker-compose.yml" up -d

echo "[2/3] Starting Spring Boot..."
nohup "$MIC/mvnw" -f "$MIC/pom.xml" spring-boot:run > /tmp/mydocs-backend.log 2>&1 &
echo $! > /tmp/mydocs-backend.pid
echo "      PID $(cat /tmp/mydocs-backend.pid) — logs: /tmp/mydocs-backend.log"

echo "[3/3] Starting SPA..."
nohup bun --cwd "$SPA" run dev > /tmp/mydocs-spa.log 2>&1 &
echo $! > /tmp/mydocs-spa.pid
echo "      PID $(cat /tmp/mydocs-spa.pid) — logs: /tmp/mydocs-spa.log"

echo ""
echo "System up. Backend: http://localhost:8080 | SPA: http://localhost:5175"
