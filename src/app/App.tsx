import { useApp, useInput } from "ink";
import { type ReactNode, useState } from "react";
import { ViewportBottom } from "../ink/components/ViewportBottom";
import { interpretMenuKey } from "../keybindings/menuKeys";
import { CategoryPickerScreen } from "../screens/CategoryPickerScreen";
import { CommandInputScreen } from "../screens/CommandInputScreen";
import { CommandPickerScreen } from "../screens/CommandPickerScreen";
import { GitCommitScreen } from "../screens/GitCommitScreen";
import type { MenuScreenId } from "../screens/types";
import { runCommand } from "../services/runCommand";
import type { DevMenuCategory } from "../types";
import { getGitCommitInputPair } from "../utils/gitCommitInputPair";

type Props = {
  rootDir: string;
  categories: DevMenuCategory[];
};

/** Root Ink tree: screen state, command flow, and global key handling. */
export function App({ rootDir, categories }: Props) {
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

  function resetCommandFlow(nextScreen: MenuScreenId = "commands") {
    setActiveCommandIndex(null);
    setInputIndex(0);
    setInputValues({});
    setScreen(nextScreen);
  }

  function beginCommandFlow(commandIndex: number) {
    if (!activeCategory) return;
    const command = activeCategory.commands[commandIndex];
    if (!command) return;

    setActiveCommandIndex(commandIndex);
    setInputIndex(0);
    setInputValues({});

    if (command.inputs?.length) {
      setScreen("command-input");
      return;
    }
    const { code, signal } = runCommand(rootDir, command);
    if (signal) {
      process.exit(1);
    }
    process.exit(code === null ? 1 : code);
  }

  useInput((input, key) => {
    if (screen === "command-input") {
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

  if (
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
  } else if (screen === "commands" && activeCategory) {
    screenContent = (
      <CommandPickerScreen
        key={activeCategory.name}
        category={activeCategory}
        onSelectCommand={(commandIndex) => {
          beginCommandFlow(commandIndex);
        }}
      />
    );
  } else {
    screenContent = (
      <CategoryPickerScreen
        categories={categories}
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
