import type { MenuScreenId } from "../screens/types";

export type MenuKeyAction = { type: "quit" } | { type: "back-to-categories" };

/**
 * Global menu keys that apply on top of ink-select-input (q, escape, b, ←).
 * Return null when the key should fall through to the focused control.
 */
export function interpretMenuKey(
  input: string,
  key: { escape: boolean; leftArrow: boolean },
  screen: MenuScreenId,
): MenuKeyAction | null {
  if (input === "q") {
    return { type: "quit" };
  }
  if (key.escape) {
    if (screen === "commands") {
      return { type: "back-to-categories" };
    }
    return { type: "quit" };
  }
  if (screen === "commands" && (input === "b" || key.leftArrow)) {
    return { type: "back-to-categories" };
  }
  return null;
}
