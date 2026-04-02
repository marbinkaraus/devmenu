import {
  type ResolvedConfig,
  resolveMenuConfig,
} from "../config/resolveMenuConfig";

/**
 * Resolve menu config from cwd or exit with code 1 on failure.
 */
export function bootstrapMenu(cwd: string): ResolvedConfig {
  try {
    return resolveMenuConfig(cwd);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("devmenu:", msg);
    process.exit(1);
  }
}
