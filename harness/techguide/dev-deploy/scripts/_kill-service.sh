#!/usr/bin/env bash
# Usage: _kill-service.sh <label> <pid-file> <port>
LABEL="$1"
PID_FILE="$2"
PORT="$3"

KILLED=false

# Kill by PID file
if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"
  if kill "$PID" 2>/dev/null; then
    KILLED=true
  fi
  rm -f "$PID_FILE"
fi

# Kill any remaining process on the port
PORT_PIDS="$(lsof -ti :"$PORT" 2>/dev/null || true)"
if [ -n "$PORT_PIDS" ]; then
  echo "$PORT_PIDS" | xargs kill 2>/dev/null && KILLED=true
fi

if [ "$KILLED" = true ]; then
  echo "      Stopped"
else
  echo "      Already stopped"
fi
