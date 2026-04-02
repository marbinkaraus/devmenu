import type { ReactNode } from "react";
import { Column } from "../primitives/Column";

type Props = {
  children: ReactNode;
};

/** Standard full-screen column; adjust spacing tokens here as layouts grow. */
export function ScreenColumn({ children }: Props) {
  return <Column>{children}</Column>;
}
