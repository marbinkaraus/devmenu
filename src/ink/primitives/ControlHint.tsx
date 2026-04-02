import { Text } from "ink";
import type { ReactNode } from "react";
import { THEME } from "../../constants/theme";

type Props = {
  children: ReactNode;
};

/** Keyboard / navigation strip — distinct from the sub-headline; uses icons in copy. */
export function ControlHint({ children }: Props) {
  return (
    <Text color={THEME.muted} dimColor>
      {children}
    </Text>
  );
}
