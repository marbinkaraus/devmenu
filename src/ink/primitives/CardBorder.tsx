import { Box, Text, useStdout } from "ink";
import type { ReactNode } from "react";
import { SPACING } from "../../constants/spacing";

type Props = {
  children: ReactNode;
  /** When set and `focused` is true, highlights the border (e.g. active field). */
  accentColor?: string;
  focused?: boolean;
};

/** Rounded bordered container for inputs and text areas — one visual token for “inset field”. */
export function CardBorder({ children, accentColor, focused = false }: Props) {
  return (
    <Box
      borderStyle="round"
      borderColor={focused && accentColor ? accentColor : undefined}
      paddingX={1}
    >
      {children}
    </Box>
  );
}

type LabeledProps = {
  title: ReactNode;
  children: ReactNode;
  accentColor?: string;
  focused?: boolean;
};

function titlePlain(title: ReactNode): string {
  if (typeof title === "string" || typeof title === "number") {
    return String(title);
  }
  return "Field";
}

function FieldsetTop({
  title,
  width,
  accent,
}: {
  title: string;
  width: number;
  accent?: string;
}) {
  const inner = Math.max(4, width - 2);
  const maxTitle = Math.max(1, inner - 4);
  let show = title;
  if (show.length > maxTitle) {
    show = `${show.slice(0, Math.max(1, maxTitle - 1))}…`;
  }
  const mid = ` ${show} `;
  const dashCount = Math.max(0, inner - mid.length);
  const dashes = "─".repeat(dashCount);
  return (
    <Text>
      <Text color={accent}>╭</Text>
      <Text bold color={accent}>
        {mid}
      </Text>
      <Text color={accent}>{dashes}╮</Text>
    </Text>
  );
}

function FieldsetBottom({ width, accent }: { width: number; accent?: string }) {
  const run = Math.max(1, width - 2);
  return <Text color={accent}>╰{"─".repeat(run)}╯</Text>;
}

/**
 * Fieldset-style label on the top border (not inside the input block). Uses a custom
 * `╭─ title ─╮` row plus side borders only, so Ink’s paint order cannot hide the title.
 */
export function LabeledCard({
  title,
  children,
  accentColor,
  focused = false,
}: LabeledProps) {
  const { stdout } = useStdout();
  const cols = stdout.columns > 0 ? stdout.columns : 80;
  const totalWidth = Math.max(28, Math.min(cols - 6, 96));
  const accentActive = Boolean(focused && accentColor);
  const lineColor = accentActive ? accentColor : undefined;
  const label = titlePlain(title);

  return (
    <Box flexDirection="column" width={totalWidth}>
      <FieldsetTop title={label} width={totalWidth} accent={lineColor} />
      <Box
        flexDirection="column"
        width={totalWidth}
        borderStyle="round"
        borderTop={false}
        borderBottom={false}
        borderLeft
        borderRight
        borderColor={accentActive ? accentColor : undefined}
        paddingX={SPACING.fieldsetInnerX}
        paddingTop={SPACING.fieldsetInnerTop}
        paddingBottom={SPACING.fieldsetInnerBottom}
      >
        {children}
      </Box>
      <FieldsetBottom width={totalWidth} accent={lineColor} />
    </Box>
  );
}
