import { Box, Text } from "ink";
import BigText from "ink-big-text";
import { Column } from "../primitives/Column";
import { SubHeadline } from "../primitives/SubHeadline";

type Props = {
  title: string;
  description?: string;
  /** `ink-big-text` / cfonts `tiny` banner — same on every screen that uses it. */
  bannerTitle?: boolean;
  /** When set, applies color accent to the title. */
  titleColor?: string;
};

export function Header({
  title,
  description,
  bannerTitle = false,
  titleColor,
}: Props) {
  const titleNode = bannerTitle ? (
    <BigText font="tiny" text={title} colors={titleColor ? [titleColor] : []} />
  ) : titleColor ? (
    <Text bold color={titleColor}>
      {title}
    </Text>
  ) : (
    <Text bold>{title}</Text>
  );

  const descriptionMarginTop = description && bannerTitle ? -1 : undefined;

  return (
    <Column>
      {titleNode}
      {description ? (
        <Box marginTop={descriptionMarginTop}>
          <SubHeadline>{description}</SubHeadline>
        </Box>
      ) : null}
    </Column>
  );
}
