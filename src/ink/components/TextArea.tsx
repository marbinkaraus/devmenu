import { Text, useInput } from "ink";
import { useEffect, useState } from "react";
import { THEME } from "../../constants/theme";
import { Column } from "../primitives/Column";

export type TextAreaProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit?: (value: string) => void;
  readonly placeholder?: string;
  readonly showCursor?: boolean;
  readonly focus?: boolean;
  /** Which key inserts a newline in multiline mode. */
  readonly newlineKey?: "tab" | "enter";
};

function lineStartOffsets(value: string): number[] {
  const lines = value.split("\n");
  const starts: number[] = [0];
  let pos = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    pos += lines[i].length + 1;
    starts.push(pos);
  }
  return starts;
}

function offsetToLineCol(
  value: string,
  offset: number,
): { line: number; col: number } {
  const starts = lineStartOffsets(value);
  let line = 0;
  for (let i = starts.length - 1; i >= 0; i--) {
    if (offset >= starts[i]) {
      line = i;
      break;
    }
  }
  return { line, col: offset - starts[line] };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function moveVertical(value: string, offset: number, delta: number): number {
  const lines = value.split("\n");
  const starts = lineStartOffsets(value);
  const { line, col } = offsetToLineCol(value, offset);
  const nextLine = clamp(line + delta, 0, lines.length - 1);
  if (nextLine === line) return offset;
  const lineLen = lines[nextLine].length;
  const targetCol = Math.min(col, lineLen);
  return starts[nextLine] + targetCol;
}

/**
 * Multiline text field using Ink `useInput`, aligned with `ink-text-input` behavior.
 * - **Tab** → newline (Shift+Enter is unreliable across terminals)
 * - **Enter** → `onSubmit` (optional)
 * - Arrow keys move the cursor; up/down move between lines
 */
export function TextArea({
  value: originalValue,
  onChange,
  onSubmit,
  placeholder = "",
  showCursor = true,
  focus = true,
  newlineKey = "tab",
}: TextAreaProps) {
  const [cursorOffset, setCursorOffset] = useState(
    (originalValue || "").length,
  );

  useEffect(() => {
    if (!focus || !showCursor) return;
    const newValue = originalValue || "";
    setCursorOffset((previous) =>
      previous > newValue.length ? newValue.length : previous,
    );
  }, [originalValue, focus, showCursor]);

  useInput(
    (input, key) => {
      if (key.ctrl && input === "c") {
        return;
      }
      if (key.shift && key.tab) {
        return;
      }

      const applyChange = (nextValue: string, nextOffset: number) => {
        const o = clamp(nextOffset, 0, nextValue.length);
        setCursorOffset(o);
        if (nextValue !== originalValue) {
          onChange(nextValue);
        }
      };

      const insertAtCursor = (fragment: string) => {
        const next =
          originalValue.slice(0, cursorOffset) +
          fragment +
          originalValue.slice(cursorOffset);
        applyChange(next, cursorOffset + fragment.length);
      };

      if (newlineKey === "tab" && key.tab) {
        insertAtCursor("\n");
        return;
      }

      if (key.return) {
        if (newlineKey === "enter") {
          insertAtCursor("\n");
        } else if (onSubmit) {
          onSubmit(originalValue);
        }
        return;
      }

      if (key.escape) {
        return;
      }

      if (key.upArrow) {
        if (showCursor) {
          setCursorOffset(moveVertical(originalValue, cursorOffset, -1));
        }
        return;
      }
      if (key.downArrow) {
        if (showCursor) {
          setCursorOffset(moveVertical(originalValue, cursorOffset, 1));
        }
        return;
      }
      if (key.leftArrow) {
        if (showCursor) {
          setCursorOffset(clamp(cursorOffset - 1, 0, originalValue.length));
        }
        return;
      }
      if (key.rightArrow) {
        if (showCursor) {
          setCursorOffset(clamp(cursorOffset + 1, 0, originalValue.length));
        }
        return;
      }
      if (key.backspace || key.delete) {
        // Match ink-text-input behavior: both keys delete left of cursor.
        if (cursorOffset > 0) {
          applyChange(
            originalValue.slice(0, cursorOffset - 1) +
              originalValue.slice(cursorOffset),
            cursorOffset - 1,
          );
        }
        return;
      }
      if (input) {
        insertAtCursor(input);
      }
    },
    { isActive: focus },
  );

  const lines = originalValue.split("\n");
  const lineStarts = lineStartOffsets(originalValue);
  const { line: activeLine, col: activeCol } = offsetToLineCol(
    originalValue,
    cursorOffset,
  );
  const placeholderMode = originalValue.length === 0 && placeholder.length > 0;
  const renderedLines = placeholderMode ? placeholder.split("\n") : lines;

  return (
    <Column>
      {renderedLines.map((line, lineIndex) => {
        const isActiveLine = lineIndex === activeLine && showCursor && focus;
        const col =
          isActiveLine && !placeholderMode
            ? clamp(activeCol, 0, line.length)
            : -1;
        return (
          <TextAreaLine
            key={
              placeholderMode
                ? `placeholder-${lineIndex}`
                : lineStarts[lineIndex]
            }
            line={line}
            lineIndex={lineIndex}
            lineCount={renderedLines.length}
            showCursor={isActiveLine}
            column={col}
            placeholderMode={placeholderMode}
          />
        );
      })}
    </Column>
  );
}

type LineProps = {
  line: string;
  lineIndex: number;
  lineCount: number;
  showCursor: boolean;
  column: number;
  placeholderMode?: boolean;
};

function TextAreaLine({
  line,
  lineIndex,
  lineCount,
  showCursor,
  column,
  placeholderMode,
}: LineProps) {
  if (placeholderMode) {
    if (lineIndex === 0 && showCursor) {
      const first = line[0] ?? " ";
      const rest = line.slice(1);
      return (
        <Text color={THEME.muted} dimColor>
          <Text inverse>{first}</Text>
          {rest}
        </Text>
      );
    }
    return (
      <Text color={THEME.muted} dimColor>
        {line.length === 0 ? " " : line}
      </Text>
    );
  }

  if (!showCursor || column < 0) {
    // Keep empty rows visible in the textarea box.
    return <Text>{line.length === 0 ? " " : line}</Text>;
  }

  const col = clamp(column, 0, line.length);
  const before = line.slice(0, col);
  const at = line[col];
  const after = line.slice(col + 1);

  return (
    <Text>
      {before}
      {at !== undefined ? <Text inverse>{at}</Text> : <Text inverse> </Text>}
      {after}
      {lineIndex === lineCount - 1 && col === line.length && line.length > 0 ? (
        <Text inverse> </Text>
      ) : null}
    </Text>
  );
}
