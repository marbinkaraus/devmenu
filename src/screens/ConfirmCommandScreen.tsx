import { Box, Text, useInput } from "ink";
import { useState } from "react";
import { HINT_CONFIRM_COMMAND } from "../constants/hints";
import { SPACING } from "../constants/spacing";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { Button } from "../ink/primitives/Button";
import { LabeledCard } from "../ink/primitives/CardBorder";
import { Column } from "../ink/primitives/Column";
import { MutedText } from "../ink/primitives/MutedText";
import { Spacing } from "../ink/primitives/Spacing";

type Props = {
  renderedCommand: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Final step when `confirm: true` on any command (except Git commit, which uses its own review). */
export function ConfirmCommandScreen({
  renderedCommand,
  confirmText,
  onConfirm,
  onCancel,
}: Props) {
  const [focus, setFocus] = useState<"run" | "cancel">("run");
  const headline = confirmText?.trim() || "Run this command?";

  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === "c")) {
      onCancel();
      return;
    }
    if (input === "q") {
      onCancel();
      return;
    }
    if (key.tab || key.leftArrow || key.rightArrow) {
      setFocus((f) => (f === "run" ? "cancel" : "run"));
      return;
    }
    if (key.return) {
      if (focus === "run") onConfirm();
      else onCancel();
    }
  });

  return (
    <ScreenShell
      title="Confirm"
      bannerTitle
      titleColor={THEME.banner}
      description={headline}
      hint={HINT_CONFIRM_COMMAND}
    >
      <Column>
        <LabeledCard
          title="Command"
          accentColor={THEME.fieldFocusBorder}
          focused={false}
        >
          {renderedCommand.trim() ? (
            <Text>{renderedCommand}</Text>
          ) : (
            <MutedText>(empty)</MutedText>
          )}
        </LabeledCard>
        <Spacing size="actions" />
        <Box flexDirection="row" gap={SPACING.gap}>
          <Button label="Run" selected={focus === "run"} />
          <Button label="Cancel" selected={focus === "cancel"} />
        </Box>
      </Column>
    </ScreenShell>
  );
}
