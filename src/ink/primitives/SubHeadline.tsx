import { Text } from "ink";
import type { ReactNode } from "react";
import { THEME } from "../../constants/theme";

type Props = {
  children: ReactNode;
};

/** One step below the main title: softer than body copy, not the control strip. */
export function SubHeadline({ children }: Props) {
  return (
    <Text color={THEME.muted} dimColor italic>
      {children}
    </Text>
  );
}
