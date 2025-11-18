// filepath: scripts/worker_http.js
// Minimal HTTP health server for Azure App Service startup/health probes
const http = require('http');
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;
const workerId = process.env.WORKER_ID || null;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', pid: process.pid, workerId, now: new Date().toISOString() }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`worker_http: listening on port ${port}`);
});

function shutdown(code) {
  server.close(() => process.exit(code));
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
