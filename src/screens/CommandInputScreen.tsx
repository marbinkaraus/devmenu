import { Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useMemo, useState } from "react";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { TextArea } from "../ink/components/TextArea";
import { LabeledCard } from "../ink/primitives/CardBorder";
import { Column } from "../ink/primitives/Column";
import { Spacing } from "../ink/primitives/Spacing";
import type { DevMenuInputSpec } from "../types";

type Props = {
  input: DevMenuInputSpec;
  onCancel: () => void;
  onSubmit: (value: string) => void;
};

/**
 * Collects a single `command.inputs` field (after any combined git-commit screen).
 * Wired from `App` when a command defines named `{{placeholders}}`.
 */
export function CommandInputScreen({ input, onCancel, onSubmit }: Props) {
  const initialValue = useMemo(() => input.default ?? "", [input.default]);
  const [value, setValue] = useState(initialValue);
  const multiline = Boolean(input.multiline);
  const required = Boolean(input.required);
  const prompt = input.label?.trim() || input.name;
  const placeholder = input.placeholder?.trim();

  useInput((inputStr, key) => {
    if (key.escape) {
      onCancel();
    }
    if (key.ctrl && inputStr === "c") {
      onCancel();
    }
  });

  if (!multiline) {
    return (
      <ScreenShell
        title="Command Input"
        bannerTitle
        titleColor={THEME.banner}
        description="Provide a value for the selected command."
        hint="type · ⏎ submit · Esc cancel"
      >
        <Column>
          <LabeledCard
            title={prompt}
            accentColor={THEME.fieldFocusBorder}
            focused
          >
            <TextInput
              value={value}
              onChange={(next) => {
                setValue(next);
              }}
              onSubmit={(next) => {
                if (required && !next.trim()) return;
                onSubmit(next);
              }}
              placeholder={placeholder}
              focus
              showCursor
            />
          </LabeledCard>
          {required && !value.trim() ? (
            <>
              <Spacing size="stack" />
              <Text color={THEME.warning}>This field is required.</Text>
            </>
          ) : null}
        </Column>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Command Input"
      bannerTitle
      titleColor={THEME.banner}
      description="Provide a value for the selected command."
      hint="Tab newline · ⏎ submit · Esc cancel · ↑↓ lines"
    >
      <Column>
        <LabeledCard
          title={prompt}
          accentColor={THEME.fieldFocusBorder}
          focused
        >
          <TextArea
            value={value}
            onChange={setValue}
            onSubmit={(next) => {
              if (required && !next.trim()) return;
              onSubmit(next);
            }}
            placeholder={placeholder}
            focus
            showCursor
          />
        </LabeledCard>
        {required && !value.trim() ? (
          <>
            <Spacing size="stack" />
            <Text color={THEME.warning}>This field is required.</Text>
          </>
        ) : null}
      </Column>
    </ScreenShell>
  );
}
