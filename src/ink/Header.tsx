import { Box, Text } from "ink";

type Props = {
  title: string;
  subtitle?: string;
  /** When set, uses Ink's `color` prop on the title (omit for default foreground). */
  titleColor?: string;
};

export function Header({ title, subtitle, titleColor }: Props) {
  return (
    <Box flexDirection="column">
      {titleColor ? (
        <Text bold color={titleColor}>
          {title}
        </Text>
      ) : (
        <Text bold>{title}</Text>
      )}
      {subtitle ? <Text dimColor>{subtitle}</Text> : null}
    </Box>
  );
}
