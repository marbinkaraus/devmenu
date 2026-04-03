<div align="center">
  <img src="https://raw.githubusercontent.com/marbinkaraus/devmenu/main/media/logo.png" alt="devmenu" width="220" />

  <h3>✨ Your project commands. One pretty menu.</h3>

  <p><strong>A terminal UI that’s actually nice to look at</strong> — browse and run categorized shell commands, <strong>search</strong> the whole list, and keep <strong>everything in one place</strong> instead of hunting through <code>package.json</code>, readmes, and random docs. Each entry shows <strong>what it does</strong> and the <strong>exact command</strong>, so you learn without trying.</p>

  <p>
    <a href="https://www.npmjs.com/package/devmenu"><img src="https://img.shields.io/npm/v/devmenu.svg?style=for-the-badge&labelColor=24202C&color=b6377d" alt="npm" /></a>
    <a href="https://github.com/marbinkaraus/devmenu"><img src="https://img.shields.io/github/stars/marbinkaraus/devmenu?label=Stars&style=for-the-badge&labelColor=24202C&color=b6377d" alt="stars" /></a>
    <a href="package.json"><img src="https://img.shields.io/node/v/devmenu?style=for-the-badge&labelColor=24202C&color=b6377d" alt="node" /></a>
  </p>

  <p>
    <a href="#installation">📦 Install</a>
    · <a href="#getting-started">🚀 Getting started</a>
    · <a href="#features">✨ Features</a>
    · <a href="#configure-your-menu">⚙️ Configure</a>
    · <a href="#usage">⌨️ Usage</a>
  </p>

</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/marbinkaraus/devmenu/main/media/demo.gif" alt="Screen recording of the devmenu terminal UI" width="720" />
</p>

---

## 🎯 Why you’ll like it

- **⌨️ It’s a TUI** — keyboard-first, fast, stays in your terminal.
- **🪄 It looks good** — polished layout and colors, not a spreadsheet cosplaying as an app.
- **🎯 Dead simple** — pick a category, pick a command, hit Enter. Hints sit on every screen.
- **🔍 Categories + search** — organize commands your way; press **`s`** to filter by name, command text, or tags.
- **📚 One menu to rule them all** — stop re-opening five files to remember how this repo runs tests or deploys.
- **💡 Learn while you use** — descriptions plus the real shell line, side by side.
- **🛡️ Guard the scary stuff** — optional prompts, `{{placeholders}}`, and a confirm step with **your** wording for destructive tasks.
- **📄 YAML or JSON** — one structured file is your entire menu; **`devmenu init`** copies a commented starter from the package (Git, General, Scripts examples you can trim).

---

<a id="features"></a>

## ✨ Features

### 🔎 Browse & search

- **Categories** — you define them in config; the shipped examples include **Git**, **General**, and **Scripts** starters you can delete or edit freely.
- **Search** — **`s`** filters across labels, the command string, and **tags** (tags power search but stay out of your way in lists).

> [!TIP]
> devmenu is the **browsable, searchable face** on top of whatever you already use — keep **`just`**, npm scripts, Make, or other runners; this doesn’t replace them.

### 🛡️ Run with guardrails

- **Inputs** — collect values before run; template them into `command` / `cwd` with `{{name}}`.
- **Confirm** — optional yes/no with optional **custom** `confirmText` for “are you sure you meant production?” moments.
- **Git with polish** — nicer flow for commit-style commands where it fits.

> [!WARNING]
> Commands run in a real shell with the privileges of **your** user. Prefer **`confirm`** / **`confirmText`** (and careful `cwd`) for anything that touches production, deletes data, or spends money.

### 📁 Your menu file

- **`devmenu init`** drops a ready-to-edit **`devmenu.yaml`** (or **`devmenu.json`**) from the shipped examples — a full starter menu.
- **Clear schema** — see the field table under [Configure your menu](#configure-your-menu) and the full commented **`devmenu.example.yaml`** in the package.

---

<a id="requirements"></a>

## 📋 Requirements

> [!IMPORTANT]
> **Node.js 20 or newer** is required. The published CLI is plain JavaScript and runs on Node; you don’t need Bun installed to use devmenu from npm.

---

<a id="installation"></a>

## 📦 Installation

### npm (global)

```bash
npm install -g devmenu
```

### npx (no global install)

```bash
npx devmenu
```

### From source

Clone the repo and follow [Developing](#developing).

---

<a id="getting-started"></a>

## 🚀 Getting started

From your project root:

```bash
cd /path/to/your/project
devmenu init          # creates devmenu.yaml from the shipped example (use --json for JSON)
devmenu               # open the menu — you’re live
```

> [!TIP]
> Prefer JSON? Run **`devmenu init --json`** once. Need to regenerate? **`devmenu init --force`** overwrites the existing file.

---

<a id="usage"></a>

## ⌨️ Usage

Run **`devmenu`** in a terminal inside your project.

> [!NOTE]
> **Controls and shortcuts** are shown on the hint row at the bottom of each screen — you don’t have to memorize this README while you work.

### CLI

| Command | Description |
| --- | --- |
| `devmenu` | Open the TUI |
| `devmenu --help` / `-h` | Print help |
| `devmenu --version` / `-v` / `-V` | Print version |
| `devmenu init` | Create **`devmenu.yaml`** from the shipped example |
| `devmenu init --json` | Create **`devmenu.json`** instead |
| `devmenu init --force` | Overwrite if that file already exists |

---

<a id="configure-your-menu"></a>

## ⚙️ Configure your menu

**Start with init.** In your project directory, run **`devmenu init`** (or **`devmenu init --json`**). That writes **`devmenu.yaml`** or **`devmenu.json`** next to your work, copied from the package examples — the same flow as [Getting started](#getting-started).

Edit the file to add **categories** and **commands**. Minimal shape:

```yaml
categories:
  - name: Scripts
    commands:
      - label: Install deps
        description: Install dependencies
        command: npm install
      - label: Test
        command: npm test
```

| Field | Required | Description |
| --- | --- | --- |
| `label` | yes | List label |
| `command` | yes | Shell command; use `{{name}}` for input placeholders |
| `description` | no | Shown in the details panel |
| `cwd` | no | Working directory (relative to config root or absolute) |
| `tags` | no | Matched by search only (not shown in the UI) |
| `inputs` | no | Collect values before run; see shipped examples |
| `confirm` | no | Ask before executing |
| `confirmText` | no | Custom confirmation message |

Full commented references: **`devmenu.example.yaml`** and **`devmenu.example.json`** (included in the npm package).

<details>
<summary><strong>📂 Other filenames & discovery</strong></summary>

devmenu can also pick up **`devmenu.yml`**, **`.devmenu.yaml`**, **`.devmenu.yml`**, **`devmenu.json`**, or **`.devmenu.json`**. It walks **up** from the current working directory and uses the **first** matching file in the **nearest** directory that has one. If several of those names exist in the **same** directory, priority is:

`devmenu.yaml` → `devmenu.yml` → `.devmenu.yaml` → `.devmenu.yml` → `devmenu.json` → `.devmenu.json`

> [!CAUTION]
> Without a config file in that walk, the menu is **empty**. Run **`devmenu init`** or add **`devmenu.yaml`** / **`devmenu.json`** yourself.

The file devmenu loads is the **complete** menu — the CLI does **not** inject categories or commands.

> [!NOTE]
> Run devmenu from the **project directory you care about** (or a subfolder); discovery starts at the current working directory and moves upward.

</details>

---

<a id="developing"></a>

## 🧑‍💻 Developing

**Built with [Ink](https://github.com/vadimdemedes/ink)** (React in the terminal). This repo uses [Bun](https://bun.sh) for local TypeScript and for producing the published **`cli.js`**; end users only need **Node**.

> [!TIP]
> After cloning, **`bun install`** then **`bun run dev`** (or **`bun run devmenu`**) runs the TypeScript entrypoint. **`bun run build`** writes **`cli.js`** (gitignored locally; produced on publish).

```bash
bun install
bun run dev          # same as: bun run devmenu
bun run check        # Biome (use check:fix to apply)
bun run typecheck
bun run build        # writes ./cli.js (gitignored; runs on publish)
```

Layout: **`src/entrypoints/`**, **`src/app/`**, **`src/screens/`**, **`src/config/`**, **`scripts/build-cli.ts`**. More context: **`docs/ink-ecosystem.md`**.

---

<p align="center">
  <br/>
  <sub><em>Pick a command, run it, ship it. 🚀</em></sub><br/>
  <sub>MIT · <a href="LICENSE">LICENSE</a></sub><br/><br/>
  <a href="https://github.com/vadimdemedes/ink"><img src="https://img.shields.io/badge/TUI-Ink-b6377d?style=for-the-badge&labelColor=24202C" alt="Ink" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&labelColor=24202C" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&labelColor=24202C" alt="TypeScript" /></a>
</p>
