/**
 * Semantic colors for Ink (chalk / ansi-styles [color names](https://github.com/chalk/chalk#colors)).
 *
 * Edit **`themePresets.default`** (or add presets) to retune the UI. Components should not
 * hardcode color strings — import **`THEME`**.
 *
 * **Future theme switcher:** add more keys under `themePresets`, store `activePreset` in
 * React state or config, pass `getThemePreset(activePreset)` from context, and re-render the
 * Ink root when it changes.
 */
export const themePresets = {
  default: {
    /** `ink-big-text` / `Header` screen title banner */
    banner: "green",
    /** Primary accent — selected `Button`, emphasis */
    accent: "red",
    /** `ScrollSelectList` — pointer + selected row label */
    listSelected: "red",
    /** `LabeledCard` / `CardBorder` border when the field is focused */
    fieldFocusBorder: "red",
    /** Required-field / validation messages */
    warning: "yellow",
    /** Muted copy — hints, dividers, descriptions, unselected actions */
    muted: "whiteBright",
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
