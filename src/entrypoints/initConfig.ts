import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getDevmenuPackageDir } from "./preflight";

/**
 * `devmenu init` — copy shipped example into cwd as `devmenu.yaml` or `devmenu.json`.
 */
export function wantsInit(argv: string[]): boolean {
  return argv[2] === "init";
}

export function runDevmenuInit(argv: string[], cwd: string): void {
  const rest = argv.slice(3);
  const useJson = rest.includes("--json");
  const force = rest.includes("--force");

  const exampleFile = useJson ? "devmenu.example.json" : "devmenu.example.yaml";
  const outFile = useJson ? "devmenu.json" : "devmenu.yaml";

  const pkgDir = getDevmenuPackageDir();
  const src = join(pkgDir, exampleFile);
  const dest = join(cwd, outFile);

  if (!existsSync(src)) {
    console.error(
      `devmenu: could not find ${exampleFile} next to the installed package (expected in ${pkgDir}).`,
    );
    process.exit(1);
  }

  if (existsSync(dest) && !force) {
    console.error(
      `devmenu: ${outFile} already exists. Use --force to overwrite.`,
    );
    process.exit(1);
  }

  try {
    copyFileSync(src, dest);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`devmenu: could not write ${dest}: ${msg}`);
    process.exit(1);
  }
  console.log(`Created ${dest}`);
  process.exit(0);
}
