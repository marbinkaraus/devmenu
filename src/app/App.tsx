import { useApp, useInput } from "ink";
import { type ReactNode, useEffect, useState } from "react";
import { ViewportBottom } from "../ink/components/ViewportBottom";
import { interpretMenuKey } from "../keybindings/menuKeys";
import { CategoryPickerScreen } from "../screens/CategoryPickerScreen";
import { CommandInputScreen } from "../screens/CommandInputScreen";
import { CommandPickerScreen } from "../screens/CommandPickerScreen";
import { CommandSearchScreen } from "../screens/CommandSearchScreen";
import { ConfirmCommandScreen } from "../screens/ConfirmCommandScreen";
import { GitCommitScreen } from "../screens/GitCommitScreen";
import type { MenuScreenId } from "../screens/types";
import { applyInputTemplates, runCommand } from "../services/runCommand";
import type { DevMenuCategory } from "../types";
import type { CommandSearchHit } from "../utils/commandSearch";
import { getGitCommitInputPair } from "../utils/gitCommitInputPair";

type Props = {
  rootDir: string;
  categories: DevMenuCategory[];
  hasConfigFile: boolean;
};

type SearchReturn = "categories" | "commands";

/** Root Ink tree: screen state, command flow, and global key handling. */
export function App({ rootDir, categories, hasConfigFile }: Props) {
  const { exit } = useApp();
  const [screen, setScreen] = useState<MenuScreenId>("categories");
  const [activeCategory, setActiveCategory] = useState<DevMenuCategory | null>(
    null,
  );
  const [activeCommandIndex, setActiveCommandIndex] = useState<number | null>(
    null,
  );
  const [inputIndex, setInputIndex] = useState(0);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [categorySelectedIndex, setCategorySelectedIndex] = useState(0);
  const [commandSelectedByCategory, setCommandSelectedByCategory] = useState<
    Record<string, number>
  >({});
  const [searchReturn, setSearchReturn] = useState<SearchReturn>("categories");

  useEffect(() => {
    setCategorySelectedIndex((i) =>
      Math.min(i, Math.max(0, categories.length - 1)),
    );
  }, [categories.length]);

  function resetCommandFlow(nextScreen: MenuScreenId = "commands") {
    setActiveCommandIndex(null);
    setInputIndex(0);
    setInputValues({});
    setScreen(nextScreen);
  }

  function beginCommandFlow(category: DevMenuCategory, commandIndex: number) {
    const command = category.commands[commandIndex];
    if (!command) return;

    setActiveCategory(category);
    setActiveCommandIndex(commandIndex);
    setInputIndex(0);
    setInputValues({});

    if (command.inputs?.length) {
      setScreen("command-input");
      return;
    }
    if (command.confirm) {
      setScreen("confirm-command");
      return;
    }
    const { code, signal } = runCommand(rootDir, command);
    if (signal) {
      process.exit(1);
    }
    process.exit(code === null ? 1 : code);
  }

  function openSearch(from: SearchReturn) {
    setSearchReturn(from);
    setScreen("search");
  }

  function closeSearch() {
    setScreen(searchReturn === "categories" ? "categories" : "commands");
  }

  function pickFromSearch(hit: CommandSearchHit) {
    beginCommandFlow(hit.category, hit.commandIndex);
  }

  useInput((input, key) => {
    if (
      screen === "command-input" ||
      screen === "confirm-command" ||
      screen === "search"
    ) {
      return;
    }
    if (
      (screen === "categories" || screen === "commands") &&
      input === "s" &&
      !key.ctrl &&
      !key.meta &&
      !key.shift
    ) {
      openSearch(screen === "categories" ? "categories" : "commands");
      return;
    }
    if (
      screen === "commands" &&
      (input === "b" || key.leftArrow) &&
      !key.ctrl &&
      !key.meta
    ) {
      setActiveCategory(null);
      resetCommandFlow("categories");
      return;
    }
    const action = interpretMenuKey(input, key, screen);
    if (!action) return;
    if (action.type === "quit") {
      exit();
      return;
    }
    if (action.type === "back-to-categories") {
      setActiveCategory(null);
      resetCommandFlow("categories");
      return;
    }
    if (action.type === "cancel-command-flow") {
      resetCommandFlow();
    }
  });

  let screenContent: ReactNode = null;

  if (screen === "search") {
    screenContent = (
      <CommandSearchScreen
        categories={categories}
        onPick={pickFromSearch}
        onClose={closeSearch}
        onQuit={exit}
      />
    );
  } else if (
    screen === "command-input" &&
    activeCategory &&
    activeCommandIndex !== null
  ) {
    const activeCommand = activeCategory.commands[activeCommandIndex];
    const gitCommitPair = getGitCommitInputPair(activeCommand);
    if (
      activeCommand &&
      gitCommitPair &&
      inputIndex === 0 &&
      activeCommand.inputs
    ) {
      const subjectSpec = activeCommand.inputs[gitCommitPair.subjectIndex];
      const bodySpec = activeCommand.inputs[gitCommitPair.bodyIndex];
      if (!subjectSpec || !bodySpec) {
        return null;
      }
      screenContent = (
        <GitCommitScreen
          subjectSpec={subjectSpec}
          bodySpec={bodySpec}
          requiresConfirm={Boolean(activeCommand.confirm)}
          confirmHeadline={activeCommand.confirmText}
          onCancel={resetCommandFlow}
          onSubmit={({ subject, body }) => {
            const nextValues = {
              ...inputValues,
              [subjectSpec.name]: subject,
              [bodySpec.name]: body,
            };
            setInputValues(nextValues);
            const maxIndex = Math.max(
              gitCommitPair.subjectIndex,
              gitCommitPair.bodyIndex,
            );
            const nextIndex =
              activeCommand.inputs?.findIndex((_, idx) => idx > maxIndex) ?? -1;
            if (nextIndex >= 0) {
              setInputIndex(nextIndex);
              return;
            }
            const { code, signal } = runCommand(rootDir, activeCommand, {
              inputValues: nextValues,
            });
            if (signal) {
              process.exit(1);
            }
            process.exit(code === null ? 1 : code);
          }}
        />
      );
    } else {
      const inputSpec = activeCommand?.inputs?.[inputIndex];
      if (!activeCommand || !inputSpec) {
        return null;
      }
      screenContent = (
        <CommandInputScreen
          key={`${inputIndex}-${inputSpec.name}`}
          input={inputSpec}
          onCancel={resetCommandFlow}
          onSubmit={(value) => {
            const nextValues = { ...inputValues, [inputSpec.name]: value };
            setInputValues(nextValues);
            const nextIndex = inputIndex + 1;
            if (
              activeCommand.inputs &&
              nextIndex < activeCommand.inputs.length
            ) {
              setInputIndex(nextIndex);
              return;
            }
            if (activeCommand.confirm) {
              setInputValues(nextValues);
              setScreen("confirm-command");
              return;
            }
            const { code, signal } = runCommand(rootDir, activeCommand, {
              inputValues: nextValues,
            });
            if (signal) {
              process.exit(1);
            }
            process.exit(code === null ? 1 : code);
          }}
        />
      );
    }
  } else if (
    screen === "confirm-command" &&
    activeCategory &&
    activeCommandIndex !== null
  ) {
    const cmd = activeCategory.commands[activeCommandIndex];
    if (!cmd) {
      return null;
    }
    const rendered = applyInputTemplates(cmd.command, inputValues);
    screenContent = (
      <ConfirmCommandScreen
        renderedCommand={rendered}
        confirmText={cmd.confirmText}
        onCancel={resetCommandFlow}
        onConfirm={() => {
          const { code, signal } = runCommand(rootDir, cmd, {
            inputValues,
          });
          if (signal) {
            process.exit(1);
          }
          process.exit(code === null ? 1 : code);
        }}
      />
    );
  } else if (screen === "commands" && activeCategory) {
    const commandSelectedIndex =
      commandSelectedByCategory[activeCategory.name] ?? 0;
    screenContent = (
      <CommandPickerScreen
        category={activeCategory}
        selectedIndex={commandSelectedIndex}
        onSelectedIndexChange={(i) => {
          setCommandSelectedByCategory((prev) => ({
            ...prev,
            [activeCategory.name]: i,
          }));
        }}
        onSelectCommand={(commandIndex) => {
          beginCommandFlow(activeCategory, commandIndex);
        }}
      />
    );
  } else {
    screenContent = (
      <CategoryPickerScreen
        categories={categories}
        hasConfigFile={hasConfigFile}
        selectedIndex={categorySelectedIndex}
        onSelectedIndexChange={setCategorySelectedIndex}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setScreen("commands");
        }}
      />
    );
  }

  if (screenContent === null) {
    return null;
  }

  return <ViewportBottom>{screenContent}</ViewportBottom>;
}
