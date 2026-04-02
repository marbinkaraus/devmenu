import { Box } from "ink";
import { SPACING } from "../../constants/spacing";

type Props = {
  /** Ink row units of top margin. Use a key from `SPACING` or a raw number. */
  size?: keyof typeof SPACING | number;
};

/** Vertical spacer — consistent rhythm without repeating `marginTop` literals. */
export function Spacing({ size = "section" }: Props) {
  const marginTop = typeof size === "number" ? size : SPACING[size];
  return <Box marginTop={marginTop} />;
}
