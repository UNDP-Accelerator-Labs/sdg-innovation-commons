#!/usr/bin/env node
// Simple runner that spawns the CommonJS bootstrap and pipes stdout/stderr.
const { spawn } = require('child_process');
const path = require('path');
const proc = spawn(process.execPath, [path.join(__dirname, 'process_exports.cjs')], { stdio: 'inherit', env: process.env });
proc.on('exit', (code) => { console.log('worker process exited with code', code); process.exit(code); });
proc.on('error', (err) => { console.error('failed to start worker process', err); process.exit(1); });
