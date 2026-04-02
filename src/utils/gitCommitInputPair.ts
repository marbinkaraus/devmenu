import type { DevMenuCommand } from "../types";

/** When truthy, command uses the combined git-commit subject/body screen. */
export function getGitCommitInputPair(command: DevMenuCommand): {
  subjectIndex: number;
  bodyIndex: number;
} | null {
  if (!/^\s*git\s+commit\b/i.test(command.command)) return null;
  const inputs = command.inputs;
  if (!inputs || inputs.length < 2) return null;
  const bodyIndex = inputs.findIndex((i) => Boolean(i.multiline));
  if (bodyIndex < 0) return null;
  const subjectIndex = inputs.findIndex((_, idx) => idx !== bodyIndex);
  if (subjectIndex < 0) return null;
  return { subjectIndex, bodyIndex };
}
