"use client";

import { AeroScene } from "@/components/aero/scene";
import { RetrowaveScene } from "@/components/aero/scene-retrowave";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeScene() {
  const { theme } = useTheme();
  if (theme === "retrowave") return <RetrowaveScene />;
  return <AeroScene />;
}
