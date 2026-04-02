import { Text } from "ink";
import type { ReactNode } from "react";
import { THEME } from "../../constants/theme";

type Props = {
  children: ReactNode;
  italic?: boolean;
};

/** Shared dim text primitive for hints and metadata lines. */
export function MutedText({ children, italic }: Props) {
  return (
    <Text color={THEME.muted} dimColor italic={italic}>
      {children}
    </Text>
  );
}
