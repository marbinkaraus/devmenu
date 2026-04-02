export const CLI_HELP_TEXT = `devmenu — project command menu

  devmenu            Open menu (built-in Git + General; merges devmenu.yaml / .json upward)
  --version, -v, -V  Print version and exit

  Install (npm — published bundle runs on Node 18+, no Bun needed):
    npm install -g devmenu

  Develop:
    bun install && bun run dev
    bun run build   # emits root cli.js for npm publish
`;
