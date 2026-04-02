# devmenu

Terminal UI to pick and run **categorized dev commands** ([Ink](https://github.com/vadimdemedes/ink)). **Git** and **General** are built in; add **`devmenu.yaml`**, **`.devmenu.yaml`**, or JSON variants anywhere above `cwd` in the tree — configs merge with the built-ins.

**Requires Node.js 20+**

## Install

```bash
npm install -g devmenu
```

```bash
npx devmenu
```

## Usage

```bash
devmenu
```

- **Enter** — select/run the highlighted item  
- **q** — quit  
- **Esc** — back (from commands) or quit (from categories)  
- **b** / **←** — back to categories  

## Configuration

Nearest matching config file wins (walks up from the current directory). Example `devmenu.yaml`:

```yaml
categories:
  - name: Scripts
    commands:
      - label: Install deps
        description: Install dependencies for this project
        command: npm install
      - label: Test
        description: Run all tests
        command: npm test
      - label: Git commit
        command: git commit -m "{{subject}}" -m "{{body}}"
        inputs:
          - name: subject
            required: true
          - name: body
            multiline: true
        confirm: true
        confirmText: Create this commit?
        tags: [git, commit]
```

Same category name as a built-in **appends** commands. See **`devmenu.example.yaml`** and **`devmenu.example.json`** in this repo / package.

Supported command fields:

- `label` (required)
- `command` (required)
- `description` (optional; shown in details panel)
- `cwd` (optional)
- `confirm` and `confirmText` (optional)
- `inputs` (optional; template via `{{name}}` in `command` / `cwd`)
- `tags` (optional; reserved for future search)

## CLI flags

- **`devmenu --help`**
- **`devmenu --version`** (also **`-v`** / **`-V`**)

## Developing

From a clone of this repo — [Bun](https://bun.sh) is used to run TypeScript locally and to **build** the published `cli.js` (consumers only need Node).

```bash
bun install
bun run dev          # same as: bun run devmenu
bun run check        # Biome: lint + format + imports (use check:fix to apply)
bun run typecheck
bun run build        # writes ./cli.js (gitignored; npm runs this on publish)
```

Layout: **`src/entrypoints/`** (CLI, preflight, bootstrap), **`src/screens/`**, **`src/config/`**, **`scripts/build-cli.ts`**.

## Release

See **`RELEASING.md`**.

## License

MIT — see **`LICENSE`**.
