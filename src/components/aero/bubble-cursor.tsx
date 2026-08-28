"use client";

import { useEffect, useRef, useState } from "react";

import { LiquidGlass } from "@/components/aero/liquid-glass";

const BUBBLE_SIZE = 88;
const SCROLLING_MODE_BUBBLE_SIZE = Math.round(BUBBLE_SIZE / 3);

const TEXT_HOVER_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, span, a, label, li, td, th, figcaption, blockquote, em, strong, small, button, [data-slot=card-title], [data-slot=card-description]";

const TEXT_SAMPLE_OFFSETS: Array<[number, number]> = [
  [0, 0],
  [-6, 0],
  [6, 0],
  [0, -6],
  [0, 6],
];

function sampleTextHit(clientX: number, clientY: number) {
  const target = document.elementFromPoint(clientX, clientY);
  if (!target) return false;

  const host = target.closest(TEXT_HOVER_SELECTOR);
  return Boolean(host?.textContent?.trim());
}

function textHoverStrength(clientX: number, clientY: number) {
  let hits = 0;

  for (const [offsetX, offsetY] of TEXT_SAMPLE_OFFSETS) {
    if (sampleTextHit(clientX + offsetX, clientY + offsetY)) hits += 1;
  }

  return hits >= 2 ? 1 : 0;
}

export function BubbleCursor() {
  const [enabled, setEnabled] = useState(false);

  const morphTargetRef = useRef(0);
  const scrollingRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

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
    const syncScrolling = () => {
      scrollingRef.current = document.body.classList.contains("scrolling-mode-active");
    };

    syncScrolling();
    const observer = new MutationObserver(syncScrolling);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const onLeave = () => {
      pointerRef.current.active = false;
      morphTargetRef.current = 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    let frame = 0;

    const tick = () => {
      if (scrollingRef.current) {
        morphTargetRef.current = 1;
      } else if (pointerRef.current.active) {
        morphTargetRef.current = textHoverStrength(pointerRef.current.x, pointerRef.current.y);
      } else {
        morphTargetRef.current = 0;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <LiquidGlass
        morphTargetRef={morphTargetRef}
        fullSize={BUBBLE_SIZE}
        compactSize={SCROLLING_MODE_BUBBLE_SIZE}
      />
    </div>
  );
}
