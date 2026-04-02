import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliHelpText } from "../constants/help";

function findDevmenuPackageJson(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const candidate = join(dir, "package.json");
    if (existsSync(candidate)) {
      try {
        const raw = readFileSync(candidate, "utf8");
        const pkg = JSON.parse(raw) as { name?: string };
        if (pkg.name === "devmenu") {
          return candidate;
        }
      } catch {
        /* try parent */
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("could not locate devmenu package.json");
}

export function getPackageVersion(): string {
  const path = findDevmenuPackageJson();
  const pkg = JSON.parse(readFileSync(path, "utf8")) as { version?: string };
  return typeof pkg.version === "string" ? pkg.version : "0.0.0";
}

export function wantsHelp(argv: string[]): boolean {
  const args = argv.slice(2);
  return args.includes("--help") || args.includes("-h");
}

export function wantsVersion(argv: string[]): boolean {
  const args = argv.slice(2);
  return (
    args.includes("--version") || args.includes("-v") || args.includes("-V")
  );
}

export function printCliHelp(): void {
  console.log(getCliHelpText().trimEnd());
}

export function printVersion(): void {
  console.log(getPackageVersion());
}
