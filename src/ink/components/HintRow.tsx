import { MutedText } from "../primitives/MutedText";

type Props = {
  children: string;
};

export function HintRow({ children }: Props) {
  return <MutedText>{children}</MutedText>;
}
