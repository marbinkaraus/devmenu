import figures from "figures";
import { Box, Text, useInput } from "ink";
import { useRef } from "react";
import { SELECT_LIST_VIEWPORT_ROWS } from "../../constants/layout";
import { THEME } from "../../constants/theme";
import { MutedText } from "../primitives/MutedText";

const SCROLL_EPS = 0.01;

export type ScrollSelectItem = {
  id: string;
  label: string;
};

/** Continuous scroll offset (same centering math as before). */
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

/** Integer index of the first row shown in the viewport (one line per item). */
function windowStartIndex(
  selectedIndex: number,
  itemCount: number,
  viewportRows: number,
): number {
  if (itemCount <= 0) return 0;
  const floatStart = scrollOffsetForCenteredSelection(
    selectedIndex,
    itemCount,
    viewportRows,
  );
  const maxStart = Math.max(0, itemCount - viewportRows);
  return Math.max(0, Math.min(maxStart, Math.floor(floatStart + 1e-9)));
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
 * Vim-style list: j / k and arrows, centered selection, pointer + edge dimming.
 * Implemented as a fixed viewport slice (no `ink-scroll-list`) so layout never
 * repaints at scroll 0 then jumps after async measure — that caused wobble when
 * returning to the picker with a scrolled selection.
 */
export function ScrollSelectList({
  items,
  selectedIndex,
  onSelectedIndexChange,
  onConfirm,
  viewportRows = SELECT_LIST_VIEWPORT_ROWS,
  emptyMessage = "No items.",
}: Props) {
  const selectedIndexRef = useRef(0);
  selectedIndexRef.current = selectedIndex;

  const n = items.length;
  const windowStart = windowStartIndex(selectedIndex, n, viewportRows);
  const maxScroll = Math.max(0, n - viewportRows);
  const dimFirstRow = windowStart > SCROLL_EPS;
  const dimLastRow = windowStart < maxScroll - SCROLL_EPS;

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
    <Box flexDirection="column" height={viewportRows}>
      {Array.from({ length: viewportRows }, (_, r) => {
        const i = windowStart + r;
        const edgeDim =
          (r === 0 && dimFirstRow) || (r === viewportRows - 1 && dimLastRow);

        if (i >= n) {
          return (
            <Box key={`empty-row-${i}`} flexDirection="row">
              <Box marginRight={1}>
                <Text> </Text>
              </Box>
              <Text> </Text>
            </Box>
          );
        }

        const item = items[i];
        const isSelected = i === selectedIndex;
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
    </Box>
  );
}
