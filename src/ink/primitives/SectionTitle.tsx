import { Text } from "ink";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Bold label for a field or subsection in the main area. */
export function SectionTitle({ children }: Props) {
  return <Text bold>{children}</Text>;
}
