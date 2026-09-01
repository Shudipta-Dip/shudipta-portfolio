"use client";

import { BubbleCursor } from "@/components/aero/bubble-cursor";
import { TubesCursor } from "@/components/aero/tubes-cursor";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemedCursor() {
  const { theme } = useTheme();
  if (theme === "retrowave") return <TubesCursor />;
  return <BubbleCursor />;
}
