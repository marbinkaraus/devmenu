/**
 * Bundles src/entrypoints/cli.tsx → ./cli.js for npm (Node 18+), like @anthropic-ai/claude-code’s cli.js.
 * Run: bun run scripts/build-cli.ts
 */

import { spawnSync } from "node:child_process";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = join(root, "cli.js");

const r = spawnSync(
  "bun",
  [
    "build",
    join(root, "src/entrypoints/cli.tsx"),
    "--target=node",
    "--production",
    "--outfile",
    outfile,
  ],
  { stdio: "inherit", cwd: root },
);
if (r.status !== 0) {
  process.exit(r.status ?? 1);
}

let body = readFileSync(outfile, "utf8");
body = body.replace(/^#![^\n]*\n/, "");
writeFileSync(outfile, `#!/usr/bin/env node\n${body}`, "utf8");
chmodSync(outfile, 0o755);

console.error("Wrote cli.js (Node shebang, executable)");
