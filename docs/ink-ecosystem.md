# Ink ecosystem (reference)

When building new UI in this project, prefer **native Ink APIs** (`useInput`, `useApp`, `Box`, `Text`, etc.) and **official community components** listed in the [Ink README](https://github.com/vadimdemedes/ink#useful-components) before writing custom primitives.

## Architecture (this repo)

Layers, from bottom to top:

1. **Ink** — The `ink` package: primitives (`Box`, `Text`), hooks (`useInput`, `useApp`), and rendering. Nothing in `src/` re-exports or replaces Ink; we use it directly.

2. **Optional ecosystem packages** — npm packages such as `ink-text-input`, `ink-scroll-list`, etc. (see list below). Add them when they match a need; they sit alongside Ink, not inside our UI folder.

3. **`src/ink/primitives/`** — Tiny reusable wrappers around Ink primitives we use repeatedly (for example `Column`, `MutedText`, `SubHeadline`, `ControlHint`, `Spacing`, `SectionTitle`, `CardBorder`, `LabeledCard`, `Button`, `Divider`). Vertical rhythm uses tokens from **`src/constants/spacing.ts`** so margins stay consistent across screens.

4. **`src/ink/components/`** — Composed UI blocks built from `src/ink/primitives/` and Ink ecosystem packages: header, screen shell (`header -> main -> footer`), `ScrollSelectList` (category/command pickers), and multiline `TextArea`.

5. **`src/screens/`** — Full-screen flows: category picker, command list, inputs, confirmations. Screens compose `src/ink/components/` and wire props/callbacks.

6. **`src/app/App.tsx`** — Root of the Ink tree: global screen state, navigation between screens, and key handling that applies outside individual screens. Think of it as the **flow controller**, not a generic “component” folder.

**Convention:** Start with Ink primitives directly. If a pattern repeats, extract it into `src/ink/primitives/`. If a block combines multiple primitives into app UI, place it in `src/ink/components/`. Keep one screen per file under `src/screens/` and cross-cutting flow in `src/app/App.tsx`.

**Current flow:** first screen is `CategoryPickerScreen`, second screen is `CommandPickerScreen`.

## Components (from Ink docs)

- **ink-text-input** — Text input
- **ink-spinner** — Spinner
- **ink-scroll-list** — Scrollable list (used via `ScrollSelectList` for pickers)
- **ink-link** — Link
- **ink-gradient** — Gradient color
- **ink-big-text** — Awesome text
- **ink-picture** — Display images
- **ink-tab** — Tab
- **ink-color-pipe** — Create color text with simpler style strings
- **ink-multi-select** — Select one or more values from a list
- **ink-divider** — A divider
- **ink-progress-bar** — Progress bar
- **ink-table** — Table
- **ink-ascii** — Awesome text component with more font choices, based on Figlet
- **ink-markdown** — Render syntax highlighted Markdown
- **ink-quicksearch-input** — Select component with fast, quicksearch-like navigation
- **ink-confirm-input** — Yes/No confirmation input
- **ink-syntax-highlight** — Code syntax highlighting
- **ink-form** — Form
- **ink-task-list** — Task list
- **ink-spawn** — Spawn child processes
- **ink-titled-box** — Box with a title
- **ink-chart** — Sparkline and bar chart
- **ink-scroll-view** — Scroll container
- **ink-scroll-list** — Scrollable list
- **ink-stepper** — Step-by-step wizard
- **ink-virtual-list** — Virtualized list that renders only visible items for performance
- **ink-color-picker** — Color picker

## This repo

- Single-line prompts: **`ink-text-input`**
- Multiline prompts: **`src/ink/components/TextArea.tsx`** (Ink `useInput`; **Tab** inserts a newline, **Enter** submits — avoids ambiguous Shift+Enter across terminals)
- Shared screen layout: **`src/ink/components/ScreenShell.tsx`** — header (title + optional sub-headline), main area, then footer: divider → control hint (`↑↓`, `⏎`, etc.). Optional extra footer content is rare.
- Spacing tokens: **`src/constants/spacing.ts`** (`SPACING.section`, `stack`, `actions`, `gap`, …)
