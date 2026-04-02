import { Box } from "ink";
import type { ReactNode } from "react";
import { SPACING } from "../../constants/spacing";
import { ControlHint } from "../primitives/ControlHint";
import { Divider } from "../primitives/Divider";
import { Spacing } from "../primitives/Spacing";
import { Header } from "./Header";
import { ScreenColumn } from "./ScreenColumn";

type Props = {
  title: string;
  description?: string;
  hint?: string;
  bannerTitle?: boolean;
  titleColor?: string;
  children: ReactNode;
  /** Optional extra content below the control hint (rare). */
  footer?: ReactNode;
};

/** Shared screen layout: header, main content area, footer (divider + hint + optional extra). */
export function ScreenShell({
  title,
  description,
  hint,
  bannerTitle = false,
  titleColor,
  children,
  footer,
}: Props) {
  const showFooter = hint != null || footer != null;

  return (
    <ScreenColumn>
      <Header
        title={title}
        description={description}
        bannerTitle={bannerTitle}
        titleColor={titleColor}
      />
      <Box marginTop={SPACING.section} flexDirection="column">
        {children}
      </Box>
      {showFooter ? (
        <Box flexDirection="column">
          <Spacing size="footer" />
          <Divider />
          <Spacing size="footerStack" />
          {hint ? <ControlHint>{hint}</ControlHint> : null}
          {footer ? (
            <Box marginTop={hint ? SPACING.section : 0} flexDirection="column">
              {footer}
            </Box>
          ) : null}
        </Box>
      ) : null}
    </ScreenColumn>
  );
}
