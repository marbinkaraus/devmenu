import { Box } from "ink";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  marginTop?: number;
  gap?: number;
};

/**
 * Shared vertical layout primitive based on Ink Box.
 * Keeps common column markup consistent across screens/components.
 */
export function Column({ children, marginTop, gap }: Props) {
  return (
    <Box flexDirection="column" marginTop={marginTop} gap={gap}>
      {children}
    </Box>
  );
}
