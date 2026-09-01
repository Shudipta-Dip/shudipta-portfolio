"use client";

import { useEffect, useRef, useState } from "react";

const HOTSPOT_X = 2;
const HOTSPOT_Y = 2;

export function DiamondCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      const active = !reducedMotion.matches && !coarsePointer.matches;
      setEnabled(active);
      document.body.classList.toggle("art-deco-cursor-active", active);
    };

    update();
    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      document.body.classList.remove("art-deco-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const setPosition = (x: number, y: number) => {
      cursor.style.transform = `translate3d(${x - HOTSPOT_X}px, ${y - HOTSPOT_Y}px, 0)`;
    };

    const show = () => {
      visibleRef.current = true;
      cursor.dataset.visible = "true";
    };

    const hide = () => {
      visibleRef.current = false;
      cursor.dataset.visible = "false";
    };

    const onMove = (event: MouseEvent) => {
      setPosition(event.clientX, event.clientY);
      if (!visibleRef.current) show();
    };

    const onLeave = () => hide();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="art-deco-cursor pointer-events-none fixed top-0 left-0 z-[9999]"
      data-visible="false"
      aria-hidden
    >
      <svg
        width="32"
        height="34"
        viewBox="0 0 32 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <defs>
          <linearGradient id="ad-cursor-gold-face" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1c970" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8c7348" />
          </linearGradient>
          <linearGradient id="ad-cursor-gold-edge" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#6e5a38" />
          </linearGradient>
          <linearGradient id="ad-cursor-inner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1612" />
            <stop offset="100%" stopColor="#080604" />
          </linearGradient>
        </defs>
        <path
          d="M2 2 L2 30.5 L14.5 30.5 L28 16 L11.5 2 Z"
          fill="url(#ad-cursor-gold-face)"
          stroke="#050507"
          strokeWidth="1.2"
          strokeLinejoin="miter"
        />
        <path
          d="M2 2 L2 30.5 L14.5 30.5 L28 16 L11.5 2 Z M6.5 8.5 L10.5 8.5 L19 16 L13.5 26.5 L6.5 26.5 Z"
          fill="url(#ad-cursor-gold-edge)"
          fillRule="evenodd"
          stroke="none"
        />
        <path
          d="M6.5 8.5 L10.5 8.5 L19 16 L13.5 26.5 L6.5 26.5 Z"
          fill="url(#ad-cursor-inner)"
          stroke="#050507"
          strokeWidth="0.85"
          strokeLinejoin="miter"
        />
        <path
          d="M10.5 8.5 L19 16 L13.5 26.5 L10.5 8.5 Z"
          fill="#050507"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
