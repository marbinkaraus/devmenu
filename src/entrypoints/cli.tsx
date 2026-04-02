import {
  printCliHelp,
  printVersion,
  wantsHelp,
  wantsVersion,
} from "./preflight";

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
const { App } = await import("../components/App");

const { waitUntilExit } = render(
  <App
    rootDir={resolved.rootDir}
    configLabel={resolved.configLabel}
    categories={resolved.categories}
  />,
);

await waitUntilExit();
