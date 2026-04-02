import { Box } from "ink";
import SelectInput from "ink-select-input";
import { HINT_COMMANDS } from "../constants/hints";
import { Header } from "../ink/Header";
import { HintRow } from "../ink/HintRow";
import { ScreenColumn } from "../ink/ScreenColumn";
import { runCommand } from "../services/runCommand";
import type { DevMenuCategory } from "../types";

type Item = { label: string; value: string };

type Props = {
  rootDir: string;
  category: DevMenuCategory;
};

export function CommandPickerScreen({ rootDir, category }: Props) {
  const items: Item[] = category.commands.map((c, i) => ({
    label: c.label,
    value: String(i),
  }));

  return (
    <ScreenColumn>
      <Header title={category.name} />
      <HintRow>{HINT_COMMANDS}</HintRow>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          onSelect={(item) => {
            const cmd = category.commands[Number(item.value)];
            if (!cmd) return;
            const { code, signal } = runCommand(rootDir, cmd);
            if (signal) {
              process.exit(1);
            }
            process.exit(code === null ? 1 : code);
          }}
        />
      </Box>
    </ScreenColumn>
  );
}
