import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import YAML from "yaml";
import type {
  DevMenuCategory,
  DevMenuCommand,
  DevMenuInputSpec,
} from "../types";

/** First match per directory wins; YAML before JSON if both exist. */
const CONFIG_NAMES = [
  "devmenu.yaml",
  "devmenu.yml",
  ".devmenu.yaml",
  ".devmenu.yml",
  "devmenu.json",
  ".devmenu.json",
] as const;

export type ResolvedConfig = {
  rootDir: string;
  configLabel: string;
  /** False when no `devmenu.{yaml,json}` was found (menu is empty). */
  hasConfigFile: boolean;
  categories: DevMenuCategory[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseCategoryList(raw: unknown): DevMenuCategory[] {
  if (!isRecord(raw)) {
    throw new Error("Config root must be a mapping (object)");
  }
  const cats = raw.categories;
  if (cats === undefined) {
    return [];
  }
  if (!Array.isArray(cats)) {
    throw new Error('Optional "categories" must be an array');
  }
  const categories: DevMenuCategory[] = [];
  for (const c of cats) {
    if (!isRecord(c)) continue;
    const name = c.name;
    const commands = c.commands;
    if (typeof name !== "string" || !name.trim()) continue;
    if (!Array.isArray(commands)) continue;
    const cmds: DevMenuCommand[] = [];
    for (const cmd of commands) {
      if (!isRecord(cmd)) continue;
      const label = cmd.label;
      const description = cmd.description;
      const command = cmd.command;
      if (typeof label !== "string" || !label.trim()) continue;
      if (typeof command !== "string" || !command.trim()) continue;
      const cwd = cmd.cwd;
      const tags = parseTags(cmd.tags);
      const inputs = parseInputs(cmd.inputs);
      const confirm =
        typeof cmd.confirm === "boolean" ? cmd.confirm : undefined;
      const confirmText =
        typeof cmd.confirmText === "string" && cmd.confirmText.trim()
          ? cmd.confirmText.trim()
          : undefined;
      cmds.push({
        label: label.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : undefined,
        command: command.trim(),
        cwd: typeof cwd === "string" && cwd.trim() ? cwd.trim() : undefined,
        tags,
        inputs,
        confirm,
        confirmText,
      });
    }
    if (cmds.length) categories.push({ name: name.trim(), commands: cmds });
  }
  return categories;
}

function parseTags(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const tags = raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter(Boolean);
  return tags.length ? tags : undefined;
}

function parseInputs(raw: unknown): DevMenuInputSpec[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const inputs: DevMenuInputSpec[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const name = entry.name;
    if (typeof name !== "string" || !name.trim()) continue;
    const parsed: DevMenuInputSpec = {
      name: name.trim(),
    };
    if (typeof entry.label === "string" && entry.label.trim()) {
      parsed.label = entry.label.trim();
    }
    if (typeof entry.placeholder === "string" && entry.placeholder.trim()) {
      parsed.placeholder = entry.placeholder.trim();
    }
    if (typeof entry.default === "string") {
      parsed.default = entry.default;
    }
    if (typeof entry.required === "boolean") {
      parsed.required = entry.required;
    }
    if (typeof entry.multiline === "boolean") {
      parsed.multiline = entry.multiline;
    }
    inputs.push(parsed);
  }
  return inputs.length ? inputs : undefined;
}

function cloneCategories(cats: DevMenuCategory[]): DevMenuCategory[] {
  return cats.map((c) => ({
    name: c.name,
    commands: c.commands.map((cmd) => ({ ...cmd })),
  }));
}

function loadConfigFile(configPath: string): unknown {
  const text = readFileSync(configPath, "utf8");
  const ext = extname(configPath).toLowerCase();
  if (ext === ".json") {
    return JSON.parse(text);
  }
  if (ext === ".yaml" || ext === ".yml") {
    return YAML.parse(text);
  }
  throw new Error(`Unsupported config extension: ${ext}`);
}

function findProjectConfigFile(
  startDir: string,
): { rootDir: string; configPath: string } | null {
  let dir = resolve(startDir);
  for (;;) {
    for (const name of CONFIG_NAMES) {
      const configPath = join(dir, name);
      if (existsSync(configPath)) {
        return { rootDir: dir, configPath };
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function findGitRoot(startDir: string): string | null {
  let dir = resolve(startDir);
  for (;;) {
    if (existsSync(join(dir, ".git"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function resolveMenuConfig(cwd: string): ResolvedConfig {
  const project = findProjectConfigFile(cwd);

  if (!project) {
    const rootDir = findGitRoot(cwd) ?? resolve(cwd);
    return {
      rootDir,
      configLabel: "no devmenu config",
      hasConfigFile: false,
      categories: [],
    };
  }

  let raw: unknown;
  try {
    raw = loadConfigFile(project.configPath);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`${project.configPath}: ${msg}`);
  }

  const categories = cloneCategories(parseCategoryList(raw));

  return {
    rootDir: project.rootDir,
    configLabel: project.configPath,
    hasConfigFile: true,
    categories,
  };
}
