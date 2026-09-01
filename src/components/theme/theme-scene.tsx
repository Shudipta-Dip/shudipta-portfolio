"use client";

import { AeroScene } from "@/components/aero/scene";
import { ArtDecoScene } from "@/components/aero/scene-art-deco";
import { RetrowaveScene } from "@/components/aero/scene-retrowave";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeScene() {
  const { theme } = useTheme();
  if (theme === "retrowave") return <RetrowaveScene />;
  if (theme === "art-deco") return <ArtDecoScene />;
  return <AeroScene />;
}
