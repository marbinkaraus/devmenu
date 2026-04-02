/**
 * Ink row units for vertical rhythm (marginTop / gap).
 * Tune here to shift density across all screens.
 */
export const SPACING = {
  /** Between major blocks inside the main area (after header). */
  section: 1,
  /** Between a section title and its bordered field. */
  stack: 1,
  /**
   * `LabeledCard` inner inset (whole terminal rows/columns only). Ink has no sub-row
   * padding — values like `0.5` are not reliable; keep integers.
   */
  fieldsetInnerTop: 0,
  fieldsetInnerBottom: 0,
  /** Horizontal padding inside `LabeledCard` body (beside `│` borders). */
  fieldsetInnerX: 1,
  /** Above action rows (buttons). */
  actions: 1,
  /** Between siblings in a horizontal button row. */
  gap: 2,
  /** Extra space before the footer block (after main content). */
  footer: 1,
  /** Between divider and footer text. */
  footerStack: 1,
} as const;
