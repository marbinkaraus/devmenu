import { useApp, useInput } from "ink";
import { useState } from "react";
import { interpretMenuKey } from "../keybindings/menuKeys";
import { CategoryPickerScreen } from "../screens/CategoryPickerScreen";
import { CommandPickerScreen } from "../screens/CommandPickerScreen";
import type { MenuScreenId } from "../screens/types";
import type { DevMenuCategory } from "../types";

type Props = {
  rootDir: string;
  configLabel: string;
  categories: DevMenuCategory[];
};

export function App({ rootDir, configLabel, categories }: Props) {
  const { exit } = useApp();
  const [screen, setScreen] = useState<MenuScreenId>("categories");
  const [activeCategory, setActiveCategory] = useState<DevMenuCategory | null>(
    null,
  );

  useInput((input, key) => {
    const action = interpretMenuKey(input, key, screen);
    if (!action) return;
    if (action.type === "quit") {
      exit();
      return;
    }
    if (action.type === "back-to-categories") {
      setScreen("categories");
      setActiveCategory(null);
    }
  });

  if (screen === "commands" && activeCategory) {
    return <CommandPickerScreen rootDir={rootDir} category={activeCategory} />;
  }

  return (
    <CategoryPickerScreen
      rootDir={rootDir}
      configLabel={configLabel}
      categories={categories}
      onSelectCategory={(cat) => {
        setActiveCategory(cat);
        setScreen("commands");
      }}
    />
  );
}
