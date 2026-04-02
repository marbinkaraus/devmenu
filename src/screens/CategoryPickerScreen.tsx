import { APP_DISPLAY_NAME } from "../constants/branding";
import { HINT_CATEGORIES } from "../constants/hints";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { ScrollSelectList } from "../ink/components/ScrollSelectList";
import type { DevMenuCategory } from "../types";

type Props = {
  categories: DevMenuCategory[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onSelectCategory: (category: DevMenuCategory) => void;
};

export function CategoryPickerScreen({
  categories,
  selectedIndex,
  onSelectedIndexChange,
  onSelectCategory,
}: Props) {
  const items = categories.map((c, i) => ({
    id: `${i}-${c.name}`,
    label: c.name,
  }));

  return (
    <ScreenShell
      title={APP_DISPLAY_NAME}
      bannerTitle
      titleColor={THEME.banner}
      description="Choose a category of commands."
      hint={HINT_CATEGORIES}
    >
      <ScrollSelectList
        items={items}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={onSelectedIndexChange}
        onConfirm={(i) => {
          const cat = categories[i];
          if (cat) onSelectCategory(cat);
        }}
        emptyMessage="No categories."
      />
    </ScreenShell>
  );
}
