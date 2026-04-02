import { Text } from "ink";

type Props = {
  children: string;
};

export function HintRow({ children }: Props) {
  return <Text dimColor>{children}</Text>;
}
