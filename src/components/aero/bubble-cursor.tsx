"use client";

import { useEffect, useState } from "react";

import { LiquidGlass } from "@/components/aero/liquid-glass";

const BUBBLE_SIZE = 88;
const SCROLLING_MODE_BUBBLE_SIZE = Math.round(BUBBLE_SIZE / 3);

export function BubbleCursor() {
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);

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

  useEffect(() => {
    const syncCompact = () => {
      setCompact(document.body.classList.contains("scrolling-mode-active"));
    };

    syncCompact();
    const observer = new MutationObserver(syncCompact);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  if (!enabled) return null;

  const size = compact ? SCROLLING_MODE_BUBBLE_SIZE : BUBBLE_SIZE;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <LiquidGlass
        width={size}
        height={size}
        borderRadius={size / 2}
        tintOpacity={compact ? 0.1 : 0.12}
        blur={compact ? 2 : 3}
      />
    </div>
  );
}
