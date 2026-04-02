import type { DevMenuCategory, DevMenuCommand } from "../types";

export type CommandSearchHit = {
  category: DevMenuCategory;
  commandIndex: number;
  command: DevMenuCommand;
};

export function flattenCommandsForSearch(
  categories: DevMenuCategory[],
): CommandSearchHit[] {
  return categories.flatMap((category) =>
    category.commands.map((command, commandIndex) => ({
      category,
      commandIndex,
      command,
    })),
  );
}

function queryTokens(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/** Every token must appear in at least one of label, shell command, or tags (substring). */
export function commandMatchesQuery(
  hit: CommandSearchHit,
  query: string,
): boolean {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return true;
  const { command } = hit;
  const fields = [command.label, command.command, ...(command.tags ?? [])].map(
    (s) => s.toLowerCase(),
  );
  return tokens.every((t) => fields.some((f) => f.includes(t)));
}

export function filterCommandHits(
  hits: CommandSearchHit[],
  query: string,
): CommandSearchHit[] {
  return hits.filter((h) => commandMatchesQuery(h, query));
}
