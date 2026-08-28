"use client";

import { cn } from "@/lib/utils";

export type PanelState = "default" | "expanded" | "fullscreen";

const glassControlClass =
  "reels-glass-control flex size-11 touch-manipulation items-center justify-center rounded-full text-white transition-[transform,box-shadow] duration-200 active:scale-95 md:size-12 lg:size-14";

type PanelToggleProps = {
  state: PanelState;
  onAdvance: () => void;
  className?: string;
};

export function PanelToggle({ state, onAdvance, className }: PanelToggleProps) {
  if (state === "fullscreen") return null;

  return (
    <button
      type="button"
      onClick={onAdvance}
      aria-label={state === "default" ? "Show project details" : "Enter fullscreen view"}
      className={cn(glassControlClass, className)}
    >
      {state === "default" ? (
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white" />
          <span className="size-1.5 rounded-full bg-white" />
        </span>
      ) : (
        <span className="grid grid-cols-3 gap-1" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="size-1.5 rounded-full bg-white" />
          ))}
        </span>
      )}
    </button>
  );
}

export function FullscreenLineToggle({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Show title and chips"
      className={cn(glassControlClass, className)}
    >
      <span className="block h-0.5 w-6 rounded-full bg-white" aria-hidden />
    </button>
  );
}
