"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ReelsContentShellProps = {
  width: number;
  height: number;
  children: React.ReactNode;
} & Pick<ComponentPropsWithoutRef<"div">, "className">;

/**
 * Letterbox media into the stage with CSS only — no ResizeObserver.
 * Avoids a blank/black first paint while JS measures the viewport.
 */
export function ReelsContentShell({ width, height, className, children }: ReelsContentShellProps) {
  const aspect = width / height;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center [container-type:size]"
      style={{ contain: "layout paint" }}
    >
      <div
        className={cn("relative overflow-hidden bg-[#0a1620]", className)}
        style={{
          aspectRatio: `${width} / ${height}`,
          width: `min(100cqw, calc(100cqh * ${aspect}))`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
