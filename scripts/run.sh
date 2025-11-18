#!/usr/bin/env sh
# Start heartbeat (background) and then exec the main worker (foreground)
set -e
# POSIX-safe script dir resolution
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start heartbeat in background if present
if [ -f "$SCRIPT_DIR/worker_heartbeat.js" ]; then
  nohup node "$SCRIPT_DIR/worker_heartbeat.js" >> "$SCRIPT_DIR/worker_heartbeat.log" 2>&1 &
fi

# Start main worker in foreground (so container host keeps it alive)
exec node "$SCRIPT_DIR/process_exports.cjs" >> "$SCRIPT_DIR/worker.log" 2>&1
