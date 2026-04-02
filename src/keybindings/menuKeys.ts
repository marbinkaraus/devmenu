import type { MenuScreenId } from "../screens/types";

export type MenuKeyAction =
  | { type: "quit" }
  | { type: "back-to-categories" }
  | { type: "cancel-command-flow" };

/**
 * Global menu keys (q, Esc). Return null so the focused control can handle input.
 */
export function interpretMenuKey(
  input: string,
  key: { escape: boolean },
  screen: MenuScreenId,
): MenuKeyAction | null {
  if (input === "q") {
    return { type: "quit" };
  }
  if (key.escape) {
    if (screen === "commands") {
      return { type: "back-to-categories" };
    }
    if (screen === "command-input") {
      return { type: "cancel-command-flow" };
    }
    return { type: "quit" };
  }
  return null;
}
