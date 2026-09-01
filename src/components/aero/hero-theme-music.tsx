"use client";

import { HeroArtDecoCd } from "@/components/aero/hero-art-deco-cd";
import { HeroFrutigerCd } from "@/components/aero/hero-frutiger-cd";
import { HeroRetrowaveCd } from "@/components/aero/hero-retrowave-cd";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export function HeroThemeMusic({ className }: { className?: string }) {
  const { theme } = useTheme();

  if (theme === "retrowave") {
    return <HeroRetrowaveCd className={cn("hero-theme-music", className)} />;
  }

  if (theme === "art-deco") {
    return <HeroArtDecoCd className={cn("hero-theme-music", className)} />;
  }

  return <HeroFrutigerCd className={cn("hero-theme-music", className)} />;
}
