import { describe, expect, it } from "bun:test";
import type { DevMenuCategory } from "../types";
import {
  type CommandSearchHit,
  commandMatchesQuery,
  filterCommandHits,
  flattenCommandsForSearch,
} from "./commandSearch";

const mockCategories: DevMenuCategory[] = [
  {
    name: "Git",
    commands: [
      {
        label: "Status",
        command: "git status -sb",
        tags: ["git", "status"],
      },
      {
        label: "Push",
        command: "git push",
        tags: ["git", "push", "sync"],
      },
    ],
  },
  {
    name: "Scripts",
    commands: [
      {
        label: "Install deps",
        command: "bun install",
        description: "Install project dependencies.",
      },
      {
        label: "Test",
        command: "bun test",
      },
    ],
  },
];

describe("flattenCommandsForSearch", () => {
  it("flattens all commands across categories", () => {
    const hits = flattenCommandsForSearch(mockCategories);
    expect(hits).toHaveLength(4);
    expect(hits[0].category.name).toBe("Git");
    expect(hits[0].commandIndex).toBe(0);
    expect(hits[0].command.label).toBe("Status");
  });

  it("returns empty array for empty categories", () => {
    expect(flattenCommandsForSearch([])).toHaveLength(0);
  });

  it("preserves command index within category", () => {
    const hits = flattenCommandsForSearch(mockCategories);
    const pushHit = hits.find((h) => h.command.label === "Push");
    expect(pushHit?.commandIndex).toBe(1);
  });
});

describe("commandMatchesQuery", () => {
  const allHits = flattenCommandsForSearch(mockCategories);
  const statusHit = allHits[0] as CommandSearchHit;
  const installHit = allHits[2] as CommandSearchHit;

  it("matches everything on empty query", () => {
    expect(commandMatchesQuery(statusHit, "")).toBe(true);
    expect(commandMatchesQuery(statusHit, "   ")).toBe(true);
  });

  it("matches on label substring", () => {
    expect(commandMatchesQuery(statusHit, "stat")).toBe(true);
  });

  it("matches on command string substring", () => {
    expect(commandMatchesQuery(statusHit, "git status")).toBe(true);
  });

  it("matches on tags", () => {
    expect(commandMatchesQuery(statusHit, "sync")).toBe(false);
    const pushHit = allHits[1] as CommandSearchHit;
    expect(commandMatchesQuery(pushHit, "sync")).toBe(true);
  });

  it("requires all tokens to match (AND logic)", () => {
    expect(commandMatchesQuery(statusHit, "git status")).toBe(true);
    expect(commandMatchesQuery(statusHit, "git push")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(commandMatchesQuery(statusHit, "STATUS")).toBe(true);
    expect(commandMatchesQuery(statusHit, "Git")).toBe(true);
  });

  it("does not match on description (only label, command, tags)", () => {
    expect(commandMatchesQuery(installHit, "project")).toBe(false);
  });
});

describe("filterCommandHits", () => {
  const allHits = flattenCommandsForSearch(mockCategories);

  it("returns all hits for empty query", () => {
    expect(filterCommandHits(allHits, "")).toHaveLength(4);
  });

  it("filters to matching hits only", () => {
    const results = filterCommandHits(allHits, "git");
    expect(results).toHaveLength(2);
    expect(results.every((h) => h.category.name === "Git")).toBe(true);
  });

  it("returns empty for no matches", () => {
    expect(filterCommandHits(allHits, "docker")).toHaveLength(0);
  });
});
