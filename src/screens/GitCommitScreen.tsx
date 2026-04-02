import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useState } from "react";
import { HINT_GIT_COMMIT, HINT_GIT_COMMIT_REVIEW } from "../constants/hints";
import { SPACING } from "../constants/spacing";
import { THEME } from "../constants/theme";
import { ScreenShell } from "../ink/components/ScreenShell";
import { TextArea } from "../ink/components/TextArea";
import { Button } from "../ink/primitives/Button";
import { LabeledCard } from "../ink/primitives/CardBorder";
import { Column } from "../ink/primitives/Column";
import { MutedText } from "../ink/primitives/MutedText";
import { Spacing } from "../ink/primitives/Spacing";
import type { DevMenuInputSpec } from "../types";

type Props = {
  subjectSpec: DevMenuInputSpec;
  bodySpec: DevMenuInputSpec;
  /** When set, first Submit opens review; second Submit (after optional Rework) runs. */
  requiresConfirm?: boolean;
  confirmHeadline?: string;
  onCancel: () => void;
  onSubmit: (values: { subject: string; body: string }) => void;
};

type Phase = "edit" | "review";

type EditFocus = "subject" | "body" | "editSubmit" | "cancel";
type ReviewFocus = "rework" | "reviewSubmit";
type Focus = EditFocus | ReviewFocus;

function focusNextEdit(current: EditFocus, backwards = false): EditFocus {
  const order: EditFocus[] = ["subject", "body", "editSubmit", "cancel"];
  const idx = order.indexOf(current);
  const step = backwards ? -1 : 1;
  const next = (idx + step + order.length) % order.length;
  return order[next] ?? "subject";
}

export function GitCommitScreen({
  subjectSpec,
  bodySpec,
  requiresConfirm = false,
  confirmHeadline,
  onCancel,
  onSubmit,
}: Props) {
  const bodyPlaceholder =
    bodySpec.placeholder?.trim() ||
    "- What was done\n- More things...\n\nFooter (e.g. Asana Ticket:)";
  const [subject, setSubject] = useState(subjectSpec.default ?? "");
  const [body, setBody] = useState(bodySpec.default ?? "");
  const [phase, setPhase] = useState<Phase>("edit");
  const [focus, setFocus] = useState<Focus>("subject");
  const [attempted, setAttempted] = useState(false);

  const subjectRequired = Boolean(subjectSpec.required);
  const bodyRequired = Boolean(bodySpec.required);

  const reviewHeadline =
    confirmHeadline?.trim() || "Create commit with the entered message?";

  function enterReviewIfValid() {
    if (subjectRequired && !subject.trim()) {
      setAttempted(true);
      setFocus("subject");
      return;
    }
    if (bodyRequired && !body.trim()) {
      setAttempted(true);
      setFocus("body");
      return;
    }
    if (requiresConfirm) {
      setPhase("review");
      setFocus("rework");
      return;
    }
    onSubmit({ subject, body });
  }

  function leaveReviewToEdit() {
    setPhase("edit");
    setFocus("subject");
  }

  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === "c")) {
      onCancel();
      return;
    }
    if (phase === "review") {
      if (key.tab) {
        setFocus((prev) => (prev === "rework" ? "reviewSubmit" : "rework"));
        return;
      }
      if (
        (focus === "rework" || focus === "reviewSubmit") &&
        (key.leftArrow || key.rightArrow)
      ) {
        setFocus((prev) => (prev === "rework" ? "reviewSubmit" : "rework"));
        return;
      }
      if (focus === "reviewSubmit" && key.return) {
        onSubmit({ subject, body });
        return;
      }
      if (focus === "rework" && key.return) {
        leaveReviewToEdit();
      }
      return;
    }

    if (key.tab) {
      setFocus((prev) => {
        if (prev === "rework" || prev === "reviewSubmit") return prev;
        return focusNextEdit(prev as EditFocus, key.shift);
      });
      return;
    }
    if (focus === "editSubmit" && key.return) {
      enterReviewIfValid();
      return;
    }
    if (focus === "cancel" && key.return) {
      onCancel();
      return;
    }
    if (
      (focus === "editSubmit" || focus === "cancel") &&
      (key.leftArrow || key.rightArrow)
    ) {
      setFocus((prev) => (prev === "editSubmit" ? "cancel" : "editSubmit"));
    }
  });

  return (
    <ScreenShell
      title="Git Commit"
      bannerTitle
      titleColor={THEME.banner}
      description={
        phase === "review" ? reviewHeadline : "Write commit subject and body."
      }
      hint={phase === "review" ? HINT_GIT_COMMIT_REVIEW : HINT_GIT_COMMIT}
    >
      <Column>
        {phase === "review" ? (
          <>
            <Column>
              <LabeledCard
                title={subjectSpec.label?.trim() || "Commit subject"}
                accentColor={THEME.fieldFocusBorder}
                focused={false}
              >
                {subject.trim() ? (
                  <Text>{subject.trim()}</Text>
                ) : (
                  <MutedText>(empty)</MutedText>
                )}
              </LabeledCard>
            </Column>
            <Spacing size="section" />
            <Column>
              <LabeledCard
                title={bodySpec.label?.trim() || "Commit body"}
                accentColor={THEME.fieldFocusBorder}
                focused={false}
              >
                {body.trim() ? (
                  <Text>{body}</Text>
                ) : (
                  <MutedText>(empty)</MutedText>
                )}
              </LabeledCard>
            </Column>
          </>
        ) : (
          <>
            <Column>
              <LabeledCard
                title={subjectSpec.label?.trim() || "Commit subject"}
                accentColor={THEME.fieldFocusBorder}
                focused={focus === "subject"}
              >
                <TextInput
                  value={subject}
                  onChange={setSubject}
                  onSubmit={() => {
                    setFocus("body");
                  }}
                  placeholder={subjectSpec.placeholder?.trim()}
                  focus={focus === "subject"}
                  showCursor
                />
              </LabeledCard>
              {attempted && subjectRequired && !subject.trim() ? (
                <>
                  <Spacing size="stack" />
                  <Text color={THEME.warning}>Subject is required.</Text>
                </>
              ) : null}
            </Column>

            <Spacing size="section" />

            <Column>
              <LabeledCard
                title={bodySpec.label?.trim() || "Commit body"}
                accentColor={THEME.fieldFocusBorder}
                focused={focus === "body"}
              >
                <TextArea
                  value={body}
                  onChange={setBody}
                  placeholder={bodyPlaceholder}
                  focus={focus === "body"}
                  showCursor
                  newlineKey="enter"
                />
              </LabeledCard>
              {attempted && bodyRequired && !body.trim() ? (
                <>
                  <Spacing size="stack" />
                  <Text color={THEME.warning}>Body is required.</Text>
                </>
              ) : null}
            </Column>
          </>
        )}

        <Spacing size="actions" />
        <Box flexDirection="row" gap={SPACING.gap}>
          {phase === "review" ? (
            <>
              <Button label="Rework" selected={focus === "rework"} />
              <Button label="Submit" selected={focus === "reviewSubmit"} />
            </>
          ) : (
            <>
              <Button
                label="Submit"
                selected={
                  focus === "editSubmit" ||
                  focus === "subject" ||
                  focus === "body"
                }
              />
              <Button label="Cancel" selected={focus === "cancel"} />
            </>
          )}
        </Box>
      </Column>
    </ScreenShell>
  );
}
