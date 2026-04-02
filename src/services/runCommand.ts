import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { leaveAlternateScreen } from "../entrypoints/terminalDisplay";
import type { DevMenuCommand } from "../types";

type RunCommandOptions = {
  inputValues?: Record<string, string>;
};

const TEMPLATE_RE = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;

/** Replace `{{name}}` placeholders (used for confirm preview and running). */
export function applyInputTemplates(
  source: string,
  values: Record<string, string> | undefined,
): string {
  if (!values) return source;
  return source.replace(
    TEMPLATE_RE,
    (_match, key: string) => values[key] ?? "",
  );
}

export function runCommand(
  rootDir: string,
  cmd: DevMenuCommand,
  options: RunCommandOptions = {},
): { code: number | null; signal: NodeJS.Signals | null } {
  const renderedCommand = applyInputTemplates(cmd.command, options.inputValues);
  const renderedCwd = cmd.cwd
    ? applyInputTemplates(cmd.cwd, options.inputValues)
    : undefined;
  const cwd = renderedCwd ? resolve(rootDir, renderedCwd) : rootDir;
  // So stdio: inherit writes to the normal buffer, not the Ink alternate screen.
  leaveAlternateScreen();
  const result = spawnSync(renderedCommand, {
    shell: true,
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  return { code: result.status, signal: result.signal };
}
