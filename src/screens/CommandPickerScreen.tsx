import { Box, Text } from "ink";
import { useEffect } from "react";
import { HINT_COMMANDS } from "../constants/hints";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { ScrollSelectList } from "../ink/components/ScrollSelectList";
import { Column } from "../ink/primitives/Column";
import { MutedText } from "../ink/primitives/MutedText";
import { Spacing } from "../ink/primitives/Spacing";
import type { DevMenuCategory } from "../types";

type Props = {
  category: DevMenuCategory;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onSelectCommand: (index: number) => void;
};

export function CommandPickerScreen({
  category,
  selectedIndex,
  onSelectedIndexChange,
  onSelectCommand,
}: Props) {
  const commands = category.commands;

  useEffect(() => {
    const max = Math.max(0, commands.length - 1);
    if (selectedIndex > max) {
      onSelectedIndexChange(max);
    }
  }, [commands.length, selectedIndex, onSelectedIndexChange]);

  const selectedCommand = commands[selectedIndex] ?? null;

  const items = commands.map((c, i) => ({
    id: `${i}-${c.label}-${c.command}`,
    label: c.label,
  }));

  return (
    <ScreenShell
      title={category.name}
      bannerTitle
      titleColor={THEME.banner}
      description="Choose a command to run."
      hint={HINT_COMMANDS}
    >
      <Column>
        <Box>
          <ScrollSelectList
            items={items}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={onSelectedIndexChange}
            onConfirm={onSelectCommand}
            emptyMessage="No commands in this category."
          />
        </Box>
        <Spacing size="gap" />
        <Column>
          <Text>
            {selectedCommand?.description?.trim()
              ? selectedCommand.description
              : "No description"}
          </Text>
          <MutedText italic>
            command: {selectedCommand?.command ?? "-"}
          </MutedText>
          {selectedCommand?.cwd ? (
            <MutedText italic>cwd: {selectedCommand.cwd}</MutedText>
          ) : null}
        </Column>
      </Column>
    </ScreenShell>
  );
}
