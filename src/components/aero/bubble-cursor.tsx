"use client";

import { useEffect, useState } from "react";

import { LiquidGlass } from "@/components/aero/liquid-glass";

const BUBBLE_SIZE = 88;

export function BubbleCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      const active = !reducedMotion.matches && !coarsePointer.matches;
      setEnabled(active);
      document.body.classList.toggle("bubble-cursor-active", active);
    };

    update();
    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      document.body.classList.remove("bubble-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <LiquidGlass
        width={BUBBLE_SIZE}
        height={BUBBLE_SIZE}
        borderRadius={BUBBLE_SIZE / 2}
        tintOpacity={0.12}
        blur={3}
      />
    </div>
  );
}
