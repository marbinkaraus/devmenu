# Releasing devmenu

This repo ships a **single bundled `cli.js`**, `bin` → that file, **`engines.node`**, and four runtime `dependencies` (`cfonts`, `chalk`, `figures`, `ink-text-input`) that cannot be inlined by the bundler. **`prepublishOnly` runs `bun run build`**, which emits **`cli.js`** with a **`#!/usr/bin/env node`** shebang.

## How releases work

Releases are automated via [release-please](https://github.com/googleapis/release-please).

1. **Push commits to `main`** using [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.).
2. **release-please** opens (or updates) a **Release PR** that bumps `package.json`, updates `CHANGELOG.md`, and shows you what will ship.
3. **Merge the Release PR** when you're ready. release-please creates a version tag (`v1.0.4`) and a GitHub release.
4. The **tag triggers `publish.yml`** which builds, checks, and runs `npm publish`.

That's it — no manual `npm version` or `git tag` needed.

### Commit types → version bumps

| Prefix | Bump | Example |
|--------|------|---------|
| `fix:` | patch | `fix: prevent q from quitting in search` |
| `feat:` | minor | `feat: add --config flag` |
| `feat!:` or `BREAKING CHANGE:` | major | `feat!: require Node 22` |
| `chore:`, `docs:`, `test:`, `ci:` | none | Only included in changelog, no version bump |

## One-time setup

1. [Create an npm account](https://www.npmjs.com/signup) and log in: `npm login`.
2. Set **`NPM_TOKEN`** in GitHub repo secrets (granular automation token or OIDC).

## Manual publish (fallback)

If CI is unavailable:

```bash
bun install
bun run check
bun run typecheck
bun run build && node ./cli.js --help
npm publish
```

**Do not commit `cli.js`**; it is gitignored and built at publish time.
