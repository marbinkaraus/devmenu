import { Box } from "ink";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Standard full-screen column; adjust spacing tokens here as layouts grow. */
export function ScreenColumn({ children }: Props) {
  return <Box flexDirection="column">{children}</Box>;
}
