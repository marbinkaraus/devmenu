import { Box } from "ink";
import SelectInput from "ink-select-input";
import { APP_DISPLAY_NAME } from "../constants/branding";
import { HINT_CATEGORIES } from "../constants/hints";
import { THEME } from "../constants/theme";
import { Header } from "../ink/Header";
import { HintRow } from "../ink/HintRow";
import { ScreenColumn } from "../ink/ScreenColumn";
import type { DevMenuCategory } from "../types";

type Item = { label: string; value: string };

type Props = {
  rootDir: string;
  configLabel: string;
  categories: DevMenuCategory[];
  onSelectCategory: (category: DevMenuCategory) => void;
};

export function CategoryPickerScreen({
  rootDir,
  configLabel,
  categories,
  onSelectCategory,
}: Props) {
  const items: Item[] = categories.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <ScreenColumn>
      <Header
        title={APP_DISPLAY_NAME}
        subtitle={`${configLabel} · cwd ${rootDir}`}
        titleColor={THEME.title}
      />
      <HintRow>{HINT_CATEGORIES}</HintRow>
      <Box marginTop={1}>
        <SelectInput
          items={items}
          onSelect={(item) => {
            const cat = categories.find((c) => c.name === item.value);
            if (cat) onSelectCategory(cat);
          }}
        />
      </Box>
    </ScreenColumn>
  );
}
