#!/usr/bin/env sh
# Start heartbeat (background) and then exec the main worker (foreground)
set -e
# POSIX-safe script dir resolution
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# If an .env file exists in /app, load and export it so containerized deployments that mount a file work
if [ -f "/app/.env" ]; then
  echo "Loading /app/.env"
  set -a
  # shellcheck disable=SC1090
  . /app/.env
  set +a
fi

# Helper to check whether DB config is present
check_db_config() {
  if [ -n "${GENERAL_DB_URL:-}" ] || [ -n "${DATABASE_URL:-}" ]; then
    return 0
  fi

  if [ -n "${GENERAL_DB_HOST:-}" ] && [ -n "${GENERAL_DB_USER:-}" ] && [ -n "${GENERAL_DB_PASSWORD:-}" ] && ( [ -n "${GENERAL_DB_NAME:-}" ] || [ -n "${GENERAL_DB:-}" ] ); then
    return 0
  fi

  return 1
}

# Wait up to 30s for DB envs to be injected (useful when platform injects app settings at container start)
WAIT_SECS=30
INTERVAL=2
elapsed=0
if check_db_config; then
  echo "DB config present — continuing startup"
else
  echo "DB config not present — waiting up to ${WAIT_SECS}s for environment to be injected"
  while [ $elapsed -lt $WAIT_SECS ]; do
    sleep $INTERVAL
    elapsed=$((elapsed + INTERVAL))
    if check_db_config; then
      echo "DB config detected after ${elapsed}s — continuing startup"
      break
    fi
    echo "still waiting for DB envs... (${elapsed}s)"
  done
fi

# Final check — abort if DB config still missing
if ! check_db_config; then
  echo "ERROR: Database config for \"general\" not configured after waiting ${WAIT_SECS}s. Expected GENERAL_DB_URL or DATABASE_URL or GENERAL_DB_HOST/USER/PASSWORD/NAME" >&2
  exit 1
fi

# Start heartbeat in background if present
if [ -f "$SCRIPT_DIR/worker_heartbeat.js" ]; then
  nohup node "$SCRIPT_DIR/worker_heartbeat.js" >> "$SCRIPT_DIR/worker_heartbeat.log" 2>&1 &
  BG_PID=$!
  # give it a moment to start
  sleep 0.5
  if kill -0 "$BG_PID" 2>/dev/null; then
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Started heartbeat (pid $BG_PID)" | tee -a "$SCRIPT_DIR/worker_heartbeat.log"
  else
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Failed to start heartbeat (pid $BG_PID)" | tee -a "$SCRIPT_DIR/worker_heartbeat.log" >&2
  fi
else
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - No heartbeat script found at $SCRIPT_DIR/worker_heartbeat.js" | tee -a "$SCRIPT_DIR/worker_heartbeat.log"
fi

# Start main worker in foreground (so container host keeps it alive)
# Log startup timestamp
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Starting main worker (process_exports.cjs)" | tee -a "$SCRIPT_DIR/worker.log"
exec node "$SCRIPT_DIR/process_exports.cjs" >> "$SCRIPT_DIR/worker.log" 2>&1