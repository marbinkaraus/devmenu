import { Text } from "ink";
import { THEME } from "../../constants/theme";

const CHAR = "─";

function lineWidth(): number {
  const cols =
    typeof process.stdout?.columns === "number" ? process.stdout.columns : 80;
  return Math.max(16, Math.min(cols - 2, 72));
}

/** Full-width dim rule for separating footer from main content. */
export function Divider() {
  return (
    <Text color={THEME.muted} dimColor>
      {CHAR.repeat(lineWidth())}
    </Text>
  );
}
