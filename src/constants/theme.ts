/**
 * Semantic colors as **hex** (truecolor) so the UI matches the Vitaale palette everywhere,
 * not the viewer’s unrelated terminal theme.
 *
 * Source: `~/.config/ghostty/themes/vitaale` — each role maps to the ANSI slot that named
 * Ink/chalk colors would have used on that theme.
 *
 * | Role | Vitaale palette slot (ANSI role) | Hex       |
 * |------|----------------------------------|-----------|
 * | banner | 2 — “green” | #b6377d |
 * | accent, listSelected, fieldFocusBorder | 9 — “bright red” | #f99286 |
 * | warning | 3 — “yellow” | #ecebbe |
 * | muted | 15 — “bright white” (lighter for hints; still uses dim in UI) | #e2e2e2 |
 *
 * Components import **`THEME`** only; do not hardcode colors.
 */
export const themePresets = {
  default: {
    /** `ink-big-text` / `Header` screen title banner */
    banner: "#b6377d",
    /** Primary accent — `Button`, `--help` highlights */
    accent: "#f99286",
    /** `ScrollSelectList` — pointer + selected row label */
    listSelected: "#f99286",
    /** `LabeledCard` / `CardBorder` border when the field is focused */
    fieldFocusBorder: "#f99286",
    /** Required-field / validation messages */
    warning: "#ecebbe",
    /** Muted copy — hints, dividers, descriptions, unselected actions */
    muted: "#e2e2e2",
  },
} as const;

export type ThemePresetId = keyof typeof themePresets;
export type DevMenuTheme = (typeof themePresets)[ThemePresetId];

/**
 * Active palette. Points at `themePresets.default` until a switcher selects another preset.
 */
export const THEME: DevMenuTheme = themePresets.default;

export function getThemePreset(id: ThemePresetId): DevMenuTheme {
  return themePresets[id];
}
