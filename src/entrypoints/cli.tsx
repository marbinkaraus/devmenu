import {
  printCliHelp,
  printVersion,
  wantsHelp,
  wantsVersion,
} from "./preflight";
import {
  alternateScreenEnabled,
  enterAlternateScreen,
  leaveAlternateScreen,
  registerAlternateScreenExitHook,
} from "./terminalDisplay";

if (wantsVersion(process.argv)) {
  printVersion();
  process.exit(0);
}

if (wantsHelp(process.argv)) {
  printCliHelp();
  process.exit(0);
}

const { bootstrapMenu } = await import("./bootstrap");
const resolved = bootstrapMenu(process.cwd());

const { render } = await import("ink");
const { App } = await import("../app/App");

const altScreen = alternateScreenEnabled();
if (altScreen) {
  enterAlternateScreen();
  registerAlternateScreenExitHook();
}

const { waitUntilExit } = render(
  <App rootDir={resolved.rootDir} categories={resolved.categories} />,
);

await waitUntilExit();

if (altScreen) {
  leaveAlternateScreen();
}
