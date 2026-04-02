import { Text } from "ink";
import { THEME } from "../../constants/theme";

type Props = {
  label: string;
  /** Keyboard focus — blue + brackets. */
  selected?: boolean;
};

/** One-line action: muted when idle; accent `[ label ]` when selected. */
export function Button({ label, selected = false }: Props) {
  if (selected) {
    return (
      <Text color={THEME.accent} bold>
        {`[ ${label} ]`}
      </Text>
    );
  }
  return (
    <Text color={THEME.muted} dimColor>
      {label}
    </Text>
  );
}
