import { Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HINT_SEARCH } from "../constants/hints";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { ScrollSelectList } from "../ink/components/ScrollSelectList";
import { LabeledCard } from "../ink/primitives/CardBorder";
import { Column } from "../ink/primitives/Column";
import { MutedText } from "../ink/primitives/MutedText";
import { Spacing } from "../ink/primitives/Spacing";
import type { DevMenuCategory } from "../types";
import {
  type CommandSearchHit,
  filterCommandHits,
  flattenCommandsForSearch,
} from "../utils/commandSearch";

type Focus = "query" | "list";

type Props = {
  categories: DevMenuCategory[];
  onPick: (hit: CommandSearchHit) => void;
  onClose: () => void;
  onQuit: () => void;
};

export function CommandSearchScreen({
  categories,
  onPick,
  onClose,
  onQuit,
}: Props) {
  const [query, setQueryRaw] = useState("");
  const [focus, setFocus] = useState<Focus>("query");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setQuery = useCallback((value: string) => {
    setQueryRaw((prev) => {
      if (value !== prev) {
        setSelectedIndex(0);
      }
      return value;
    });
  }, []);

  const allHits = useMemo(
    () => flattenCommandsForSearch(categories),
    [categories],
  );

  const filtered = useMemo(
    () => filterCommandHits(allHits, query),
    [allHits, query],
  );

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const selectedHit = filtered[selectedIndex] ?? null;

  const listItems = useMemo(
    () =>
      filtered.map((hit) => ({
        id: `${hit.category.name}\0${hit.commandIndex}\0${hit.command.label}\0${hit.command.command}`,
        label: `${hit.category.name} › ${hit.command.label}`,
      })),
    [filtered],
  );

  useInput((_input, key) => {
    if (key.escape) {
      onClose();
      return;
    }
    if (key.ctrl && _input === "c") {
      onClose();
      return;
    }
    if (_input === "q" && focus === "list") {
      onQuit();
      return;
    }
    if (key.tab) {
      setFocus((prev) => (prev === "query" ? "list" : "query"));
    }
  });

  function confirmSelection() {
    const hit = filtered[selectedIndex];
    if (hit) {
      onPick(hit);
    }
  }

  return (
    <ScreenShell
      title="Search commands"
      bannerTitle
      titleColor={THEME.banner}
      description="Filter by label or command. Words must all match."
      hint={HINT_SEARCH}
    >
      <Column>
        <LabeledCard
          title="Filter"
          accentColor={THEME.fieldFocusBorder}
          focused={focus === "query"}
        >
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={() => {
              confirmSelection();
            }}
            placeholder="e.g. git, test, docker…"
            focus={focus === "query"}
            showCursor
          />
        </LabeledCard>

        <Spacing size="section" />

        <ScrollSelectList
          items={listItems}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={setSelectedIndex}
          onConfirm={() => {
            confirmSelection();
          }}
          listenKeys={focus === "list"}
          emptyMessage="No matching commands."
        />

        <Spacing size="gap" />
        <Column>
          {selectedHit ? (
            <>
              <Text>
                {selectedHit.command.description?.trim()
                  ? selectedHit.command.description
                  : "No description"}
              </Text>
              <MutedText italic>
                command: {selectedHit.command.command}
              </MutedText>
              {selectedHit.command.cwd ? (
                <MutedText italic>cwd: {selectedHit.command.cwd}</MutedText>
              ) : null}
            </>
          ) : (
            <MutedText>Select a command or narrow the filter.</MutedText>
          )}
        </Column>
      </Column>
    </ScreenShell>
  );
}
