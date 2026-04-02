/** Enter the alternate screen buffer (same idea as vim/full-screen TUIs). */
const ALT_SCREEN_ON = "\x1b[?1049h";
/** Leave alternate screen and restore the previous terminal contents. */
const ALT_SCREEN_OFF = "\x1b[?1049l";

let alternateScreenActive = false;

/** When false, set env `DEVMENU_ALT_SCREEN=0` to draw inline (below your shell prompt). */
export function alternateScreenEnabled(): boolean {
  return process.env.DEVMENU_ALT_SCREEN !== "0";
}

export function enterAlternateScreen(): void {
  process.stdout.write(ALT_SCREEN_ON);
  alternateScreenActive = true;
}

export function leaveAlternateScreen(): void {
  if (!alternateScreenActive) return;
  process.stdout.write(ALT_SCREEN_OFF);
  alternateScreenActive = false;
}

/**
 * Ensures we leave the alternate screen when the process exits — including
 * `process.exit()` from command runs, which skips code after `await waitUntilExit()`.
 */
export function registerAlternateScreenExitHook(): void {
  process.once("exit", () => {
    leaveAlternateScreen();
  });
}
