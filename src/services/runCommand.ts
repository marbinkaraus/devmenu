import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import type { DevMenuCommand } from "../types";

export function runCommand(
  rootDir: string,
  cmd: DevMenuCommand,
): { code: number | null; signal: NodeJS.Signals | null } {
  const cwd = cmd.cwd ? resolve(rootDir, cmd.cwd) : rootDir;
  const result = spawnSync(cmd.command, {
    shell: true,
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  return { code: result.status, signal: result.signal };
}
