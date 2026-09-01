"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const TUBES_CURSOR_CDN =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
const IDLE_TIMEOUT_MS = 900;

type TubesCursorApp = {
  three: {
    resize: () => void;
  };
  dispose: () => void;
};

type TubesCursorModule = {
  default?: (canvas: HTMLCanvasElement, options: unknown) => TubesCursorApp;
};

export function TubesCursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<SVGSVGElement>(null);
  const appRef = useRef<TubesCursorApp | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const update = () => {
      const active = !reducedMotion.matches && !coarsePointer.matches;
      setEnabled(active);
      document.body.classList.toggle("tubes-cursor-active", active);
    };

    update();
    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      document.body.classList.remove("tubes-cursor-active");
    };
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let destroyed = false;
    let idleTimer = 0;

    const setVisible = (visible: boolean) => {
      canvas.dataset.active = String(visible);
    };

    const hideAfterIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setVisible(false), IDLE_TIMEOUT_MS);
    };

    const initialize = async () => {
      const module = (await import(
        /* webpackIgnore: true */
        TUBES_CURSOR_CDN
      )) as TubesCursorModule;
      const TubesCursor = module.default ?? module;
      if (destroyed || typeof TubesCursor !== "function") return;

      appRef.current = TubesCursor(canvas, {
        bloom: { threshold: 0, strength: 0.55, radius: 0.22 },
        tubes: {
          colors: ["#ff2d95", "#00f0ff", "#521868"],
          minRadius: 0.00035,
          maxRadius: 0.0045,
          lights: {
            intensity: 120,
            colors: ["#00f0ff", "#ff6ec7", "#ff6b35", "#ffe066"],
          },
        },
      });
      appRef.current.three.resize();
    };

    const onPointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      if (pointer) {
        pointer.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        pointer.dataset.visible = "true";
      }
      setVisible(true);
      hideAfterIdle();
    };

    const resizeObserver = new ResizeObserver(() => appRef.current?.three.resize());
    resizeObserver.observe(wrapper);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    void initialize();

    return () => {
      destroyed = true;
      window.clearTimeout(idleTimer);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      appRef.current?.dispose();
      appRef.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapperRef} className="tubes-cursor-layer pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <canvas ref={canvasRef} className="tubes-cursor-canvas block h-full w-full" data-active="false" />
      <svg
        ref={pointerRef}
        viewBox="0 0 24 24"
        className="tubes-cursor-pointer absolute top-0 left-0"
        data-visible="false"
      >
        <defs>
          <linearGradient id="retrowave-pointer-gradient" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#00f0ff" />
            <stop offset="0.52" stopColor="#ff2d95" />
            <stop offset="1" stopColor="#ffe066" />
          </linearGradient>
        </defs>
        <path
          d="M4 2.5 19.5 12 12.5 13.5 9 21.5Z"
          fill="none"
          stroke="url(#retrowave-pointer-gradient)"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </div>
  );
}
