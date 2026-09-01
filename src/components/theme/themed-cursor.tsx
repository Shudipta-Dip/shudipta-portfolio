"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/theme/theme-provider";

const BubbleCursor = dynamic(
  () => import("@/components/aero/bubble-cursor").then((module) => module.BubbleCursor),
  { ssr: false },
);
const TubesCursor = dynamic(
  () => import("@/components/aero/tubes-cursor").then((module) => module.TubesCursor),
  { ssr: false },
);

export function ThemedCursor() {
  const { theme } = useTheme();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!finePointer) return null;
  if (theme === "retrowave") return <TubesCursor />;
  return <BubbleCursor />;
}
