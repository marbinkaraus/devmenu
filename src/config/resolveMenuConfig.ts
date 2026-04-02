import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import YAML from "yaml";
import type { DevMenuCategory, DevMenuCommand } from "../types";
import { getBuiltInCategories } from "./defaults";

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
      const command = cmd.command;
      if (typeof label !== "string" || !label.trim()) continue;
      if (typeof command !== "string" || !command.trim()) continue;
      const cwd = cmd.cwd;
      cmds.push({
        label: label.trim(),
        command: command.trim(),
        cwd: typeof cwd === "string" && cwd.trim() ? cwd.trim() : undefined,
      });
    }
    if (cmds.length) categories.push({ name: name.trim(), commands: cmds });
  }
  return categories;
}

function cloneCategories(cats: DevMenuCategory[]): DevMenuCategory[] {
  return cats.map((c) => ({
    name: c.name,
    commands: c.commands.map((cmd) => ({ ...cmd })),
  }));
}

export function mergeProjectOntoBuiltIns(
  builtIn: DevMenuCategory[],
  project: DevMenuCategory[],
): DevMenuCategory[] {
  const result = cloneCategories(builtIn);
  for (const pc of project) {
    const match = result.find(
      (r) => r.name.toLowerCase() === pc.name.toLowerCase(),
    );
    if (match) {
      match.commands.push(...pc.commands.map((cmd) => ({ ...cmd })));
    } else {
      result.push({
        name: pc.name,
        commands: pc.commands.map((cmd) => ({ ...cmd })),
      });
    }
  }
  return result;
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
  const builtIn = getBuiltInCategories();
  const project = findProjectConfigFile(cwd);

  if (!project) {
    const rootDir = findGitRoot(cwd) ?? resolve(cwd);
    return {
      rootDir,
      configLabel: "built-in only",
      categories: cloneCategories(builtIn),
    };
  }

  let raw: unknown;
  try {
    raw = loadConfigFile(project.configPath);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`${project.configPath}: ${msg}`);
  }

  const projectCats = parseCategoryList(raw);
  const categories = mergeProjectOntoBuiltIns(builtIn, projectCats);

  return {
    rootDir: project.rootDir,
    configLabel: project.configPath,
    categories,
  };
}
