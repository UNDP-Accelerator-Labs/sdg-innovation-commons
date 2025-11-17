#!/usr/bin/env node
// Bootstrap to run the TypeScript worker in environments where ESM loader fails.
// Uses ts-node register in transpile-only mode to allow requiring .ts files.
try {
  require('ts-node').register({ transpileOnly: true, skipProject: true, compilerOptions: { module: 'commonjs', target: 'ES2017' } });
} catch (e) {
  console.error('Failed to register ts-node. Ensure ts-node is installed.', e);
  process.exit(1);
}

// Ensure TS path aliases from tsconfig are resolved (so imports like '@/app/...' work)
try {
  // tsconfig-paths will read tsconfig.json and register module resolution hooks
  require('tsconfig-paths/register');
} catch (e) {
  // Not fatal: continue but warn so maintainers know why alias resolution may fail
  console.warn('tsconfig-paths not available; path aliases (@/...) may not resolve when requiring TypeScript modules. Install tsconfig-paths to enable alias resolution.', e?.message || e);
}

// require the TS worker
require('./process_exports.ts');
