#!/usr/bin/env node
// Simple heartbeat writer for the WebJob — writes a small JSON file regularly so the main app can check worker health.
const fs = require('fs');
const path = require('path');

const heartbeatPath = process.env.WEBJOB_HEARTBEAT_FILE || path.join(process.cwd(), 'App_Data', 'jobs', 'continuous', 'worker', 'worker.heartbeat.json');
const intervalMs = Math.max(5000, parseInt(process.env.WEBJOB_HEARTBEAT_INTERVAL || '30', 10) * 1000);

function writeBeat() {
  const data = {
    timestamp: new Date().toISOString(),
    pid: process.pid,
    uptime: process.uptime(),
  };
  try {
    fs.mkdirSync(path.dirname(heartbeatPath), { recursive: true });
    fs.writeFileSync(heartbeatPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('worker_heartbeat: failed to write heartbeat', err);
  }
}

writeBeat();
const timer = setInterval(writeBeat, intervalMs);

function shutdown(code) {
  try { writeBeat(); } catch (e) {}
  clearInterval(timer);
  process.exit(code || 0);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('uncaughtException', (err) => { console.error('worker_heartbeat uncaughtException', err); shutdown(1); });

// Keep process alive
setInterval(() => {}, 1 << 30);
