import { Chalk } from "chalk";
import { THEME } from "./theme";

/** Match https://no-color.org/ and typical TTY / FORCE_COLOR behavior. */
function ansiEnabled(): boolean {
  const noColor = process.env.NO_COLOR;
  if (noColor !== undefined && noColor !== "") {
    return false;
  }
  if (process.env.FORCE_COLOR === "0") return false;
  if (process.env.FORCE_COLOR === "1" || process.env.FORCE_COLOR === "2") {
    return true;
  }
  return Boolean(process.stdout.isTTY);
}

/**
 * Short `--help` text: purpose, invocation, config pointer, examples.
 * Accent uses **`THEME.accent`** (same hex as the TUI). Honors NO_COLOR; use FORCE_COLOR=1
 * when stdout is not a TTY.
 */
export function getCliHelpText(): string {
  const on = ansiEnabled();
  const chalk = new Chalk({ level: on ? 3 : 0 });
  const hi = chalk.hex(THEME.accent);

  const lines = [
    "",
    `${hi.bold("devmenu")} ${chalk.dim("— terminal command menu")}`,
    "",
    chalk.bold("Usage"),
    `  ${hi("devmenu")}`,
    `  ${hi("devmenu -h, --help")}     ${chalk.dim("show this help")}`,
    `  ${hi("devmenu -v, --version")}  ${chalk.dim("print version")}`,
    "",
    chalk.bold("Init"),
    `  ${hi("devmenu init")}            ${chalk.dim("copy example → devmenu.yaml in cwd")}`,
    `  ${hi("devmenu init --json")}     ${chalk.dim("… → devmenu.json")}`,
    `  ${chalk.dim("Add")} ${hi("--force")} ${chalk.dim("to overwrite an existing file")}`,
    "",
    chalk.bold("Configuration"),
    `  ${chalk.dim(
      "YAML or JSON in a parent directory defines your whole menu.",
    )}`,
    `  ${chalk.dim("See")} ${hi("devmenu.example.yaml")} ${chalk.dim("(commented)")} ${chalk.dim("·")} ${hi(
      "devmenu.example.json",
    )} ${chalk.dim("·")} ${hi("README.md")}`,
    "",
  ];
  return lines.join("\n");
}
