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

/**
 * `cfonts` (used by `ink-big-text`) reads font definitions from its package on disk.
 * Bundling it breaks that; keep it external so `require("cfonts")` resolves from
 * `node_modules` after `npm install devmenu`.
 */
const external = ["cfonts"];

const r = spawnSync(
  "bun",
  [
    "build",
    join(root, "src/entrypoints/cli.tsx"),
    "--target=node",
    "--production",
    "--outfile",
    outfile,
    ...external.flatMap((pkg) => ["--external", pkg]),
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
