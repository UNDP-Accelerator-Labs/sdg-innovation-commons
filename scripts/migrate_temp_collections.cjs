#!/usr/bin/env node
// Bootstrap to run the TypeScript migration runner in environments where ESM loader fails.
// Uses ts-node register in transpile-only mode to allow requiring .ts files with CommonJS semantics.
try {
  require("ts-node").register({
    transpileOnly: true,
    skipProject: true,
    compilerOptions: { module: "commonjs", target: "ES2017" },
  });
} catch (e) {
  console.error("Failed to register ts-node. Ensure ts-node is installed.", e);
  process.exit(1);
}

// require the TS migration runner
require("./migrate_temp_collections.ts");
