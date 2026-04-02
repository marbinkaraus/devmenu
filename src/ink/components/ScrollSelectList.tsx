import figures from "figures";
import { Box, Text, useInput } from "ink";
import { ScrollList, type ScrollListRef } from "ink-scroll-list";
import { useEffect, useRef } from "react";
import { SELECT_LIST_VIEWPORT_ROWS } from "../../constants/layout";
import { THEME } from "../../constants/theme";
import { MutedText } from "../primitives/MutedText";

const SCROLL_EPS = 0.01;

export type ScrollSelectItem = {
  id: string;
  label: string;
};

function scrollOffsetForCenteredSelection(
  selectedIndex: number,
  itemCount: number,
  viewportRows: number,
): number {
  if (itemCount <= 0) return 0;
  const maxScroll = Math.max(0, itemCount - viewportRows);
  const target = selectedIndex + 0.5 - viewportRows / 2;
  return Math.max(0, Math.min(target, maxScroll));
}

function visibleRowRangeUniform(
  scrollOffset: number,
  viewportRows: number,
  itemCount: number,
): { firstVis: number; lastVis: number } {
  let firstVis = -1;
  let lastVis = -1;
  const viewEnd = scrollOffset + viewportRows;
  for (let i = 0; i < itemCount; i++) {
    const top = i;
    const bottom = i + 1;
    if (bottom > scrollOffset && top < viewEnd) {
      if (firstVis < 0) firstVis = i;
      lastVis = i;
    }
  }
  return { firstVis, lastVis };
}

type Props = {
  items: readonly ScrollSelectItem[];
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  /** Called with the current index when the user presses Enter. */
  onConfirm: (index: number) => void;
  viewportRows?: number;
  emptyMessage?: string;
};

/**
 * Shared vim-style list: j / k and arrows, center scroll, blue pointer, edge dimming.
 */
export function ScrollSelectList({
  items,
  selectedIndex,
  onSelectedIndexChange,
  onConfirm,
  viewportRows = SELECT_LIST_VIEWPORT_ROWS,
  emptyMessage = "No items.",
}: Props) {
  const listRef = useRef<ScrollListRef>(null);
  const selectedIndexRef = useRef(0);
  selectedIndexRef.current = selectedIndex;

  const n = items.length;
  const derivedOffset = scrollOffsetForCenteredSelection(
    selectedIndex,
    n,
    viewportRows,
  );
  const maxScroll = Math.max(0, n - viewportRows);
  const canScrollUp = derivedOffset > SCROLL_EPS;
  const canScrollDown = derivedOffset < maxScroll - SCROLL_EPS;
  const { firstVis, lastVis } = visibleRowRangeUniform(
    derivedOffset,
    viewportRows,
    n,
  );
  const dimTop = canScrollUp && firstVis >= 0;
  const dimBottom = canScrollDown && lastVis >= 0;

  useEffect(() => {
    const onResize = () => {
      listRef.current?.remeasure();
    };
    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);

  useInput((input, key) => {
    if (n === 0) return;
    if (input === "k" || key.upArrow) {
      onSelectedIndexChange(Math.max(0, selectedIndexRef.current - 1));
    }
    if (input === "j" || key.downArrow) {
      onSelectedIndexChange(Math.min(n - 1, selectedIndexRef.current + 1));
    }
    if (key.return) {
      onConfirm(selectedIndexRef.current);
    }
  });

  if (n === 0) {
    return <MutedText>{emptyMessage}</MutedText>;
  }

  return (
    <ScrollList
      ref={listRef}
      height={viewportRows}
      selectedIndex={selectedIndex}
      scrollAlignment="center"
    >
      {items.map((item, i) => {
        const isSelected = i === selectedIndex;
        const dimTopEdge = dimTop && i === firstVis;
        const dimBottomEdge = dimBottom && i === lastVis;
        const edgeDim = dimTopEdge || dimBottomEdge;
        return (
          <Box key={item.id} flexDirection="row">
            <Box marginRight={1}>
              {isSelected ? (
                <Text color={THEME.listSelected} dimColor={edgeDim}>
                  {figures.pointer}
                </Text>
              ) : (
                <Text dimColor={edgeDim}> </Text>
              )}
            </Box>
            <Text
              color={isSelected ? THEME.listSelected : undefined}
              dimColor={edgeDim}
            >
              {item.label}
            </Text>
          </Box>
        );
      })}
    </ScrollList>
  );
}
