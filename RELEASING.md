# Releasing devmenu (Claude Code–style)

Published [`@anthropic-ai/claude-code`](https://www.npmjs.com/package/@anthropic-ai/claude-code) ships a **single bundled `cli.js`**, `bin` → that file, **`engines.node`**, and **`dependencies: {}`**. This repo does the same: **`prepublishOnly` runs `bun run build`**, which emits **`cli.js`** with a **`#!/usr/bin/env node`** shebang.

## One-time setup

1. [Create an npm account](https://www.npmjs.com/signup) and log in: `npm login`.
2. If you use a **scoped** package name later, ensure the name in `package.json` matches and you have publish rights.

## Version bump

```bash
npm version patch   # or minor / major
```

That updates `package.json`, creates a git tag (`v0.1.1`, etc.).

## Publish to npm

From a machine with **Bun** (only needed to **build**; consumers only need Node):

```bash
bun install
npm publish
```

`prepublishOnly` runs `bun run build`, which writes **`cli.js`**. npm packs **`files`** from `package.json` (`cli.js` + examples). **Do not commit `cli.js`**; it is gitignored and built at publish time.

### CI publish (optional)

Set **`NPM_TOKEN`** in GitHub repo secrets. Pushing a tag `v*` can run `npm publish` in Actions (see `.github/workflows/publish.yml`). Use **trusted publishing** (OIDC) or a granular automation token per npm docs.

## Checklist

- [ ] `bun run check`
- [ ] `bun run typecheck`
- [ ] `bun run build && node ./cli.js --help`
- [ ] `npm version …` and push tags
- [ ] `npm publish` (or tag-driven CI)
