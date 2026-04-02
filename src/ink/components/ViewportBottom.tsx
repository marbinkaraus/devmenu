import { Box, useStdout } from "ink";
import { type ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Bottom-aligns children within the viewport. Height is **one row short** of the
 * terminal so Ink never hits `outputHeight >= stdout.rows` fullscreen mode
 * (`clearTerminal` + alternate-buffer handoff breaks `leaveAlternateScreen` +
 * `spawnSync` stdio after that change).
 */
export function ViewportBottom({ children }: Props) {
  const { stdout } = useStdout();
  const [, setResizeTick] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setResizeTick((n) => n + 1);
    };
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  const termRows = stdout.rows > 0 ? stdout.rows : 24;
  const layoutHeight = Math.max(1, termRows - 1);

  return (
    <Box
      flexDirection="column"
      height={layoutHeight}
      justifyContent="flex-end"
      width="100%"
    >
      {children}
    </Box>
  );
}
