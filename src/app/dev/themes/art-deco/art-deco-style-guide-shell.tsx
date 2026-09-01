"use client";

import { useEffect } from "react";

import { useTheme } from "@/components/theme/theme-provider";

export function ArtDecoStyleGuideShell({ children }: { children: React.ReactNode }) {
  const { setTheme, ready } = useTheme();

  useEffect(() => {
    if (!ready) return;
    setTheme("art-deco");
  }, [ready, setTheme]);

  return children;
}
