# Contributing to devmenu

Thanks for wanting to help! Here's how to get started.

## Setup

You need [Bun](https://bun.sh) (for development) and [Node.js](https://nodejs.org) 20+ (for running the built CLI).

```bash
git clone https://github.com/marbinkaraus/devmenu.git
cd devmenu
bun install
```

## Development

```bash
bun run dev          # run from TypeScript source
bun run check        # lint and format (Biome)
bun run check:fix    # auto-fix lint/format issues
bun run typecheck    # TypeScript type checking
bun test             # run test suite
bun run build        # bundle cli.js (what npm publishes)
```

## Project layout

| Directory | Purpose |
|-----------|---------|
| `src/entrypoints/` | CLI boot sequence (`cli.tsx`, `bootstrap.ts`, `initConfig.ts`) |
| `src/app/` | Root Ink component and screen state machine |
| `src/screens/` | One file per full-screen flow |
| `src/ink/primitives/` | Tiny reusable Ink wrappers |
| `src/ink/components/` | Composed UI blocks |
| `src/config/` | Config file discovery and parsing |
| `src/services/` | Command execution |
| `src/utils/` | Pure helper functions |
| `src/constants/` | Theme, layout tokens, hint strings |
| `scripts/` | Build and install scripts |

More architecture context: `docs/ink-ecosystem.md`.

## Submitting changes

1. Fork the repo and create a feature branch from `main`.
2. Make your changes. Add tests for new logic.
3. Run `bun run check && bun run typecheck && bun test` before committing.
4. Open a pull request with a clear description of what and why.

## Commit style

Use conventional-ish prefixes: `feat:`, `fix:`, `chore:`, `test:`, `docs:`.

## Code style

Biome handles formatting and linting. Run `bun run check:fix` to auto-format. The project uses double quotes and 2-space indentation.
