"use client";

import { HeroFrutigerCd } from "@/components/aero/hero-frutiger-cd";
import { HeroRetrowaveCd } from "@/components/aero/hero-retrowave-cd";
import { useTheme } from "@/components/theme/theme-provider";

export function HeroThemeMusic({ className }: { className?: string }) {
  const { theme } = useTheme();

  if (theme === "retrowave") {
    return <HeroRetrowaveCd className={className} />;
  }

  return <HeroFrutigerCd className={className} />;
}
