"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ScrollingModeLauncherProps = {
  visible: boolean;
  onOpen: () => void;
};

const RIPPLE_DELAYS = [0, 0.14, 1, 1.14, 2, 2.14];

export function ScrollingModeLauncher({ visible, onOpen }: ScrollingModeLauncherProps) {
  const [ripplesActive, setRipplesActive] = useState(false);

  useEffect(() => {
    if (!visible) {
      setRipplesActive(false);
      return;
    }

    setRipplesActive(true);
    const timer = window.setTimeout(() => setRipplesActive(false), 3000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 transition-[opacity,transform] duration-300 md:bottom-8 md:scale-110 lg:bottom-10 lg:scale-125 xl:scale-[1.35]",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {ripplesActive
        ? RIPPLE_DELAYS.map((delay, index) => (
            <span
              key={`${delay}-${index}`}
              aria-hidden
              className="scrolling-mode-ripple pointer-events-none absolute inset-0 rounded-full"
              style={{ animationDelay: `${delay}s` }}
            />
          ))
        : null}
      <button
        type="button"
        onClick={onOpen}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        className="gel-surface relative z-10 rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-foreground [text-shadow:0_1px_0_rgb(255_255_255/0.45)] shadow-[0_12px_28px_rgb(14_90_130/0.28)] md:px-7 md:py-3.5 md:text-base lg:px-8 lg:py-4 lg:text-lg"
      >
        Scrolling mode
      </button>
    </div>
  );
}
