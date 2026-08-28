"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

import { fitMediaInBox } from "@/lib/fit-media";
import { cn } from "@/lib/utils";

type ReelsContentShellProps = {
  width: number;
  height: number;
  children: React.ReactNode;
} & Pick<ComponentPropsWithoutRef<"div">, "className">;

export function ReelsContentShell({ width, height, className, children }: ReelsContentShellProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      setFrameSize(fitMediaInBox(width, height, rect.width, rect.height));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [width, height]);

  return (
    <div ref={stageRef} className="absolute inset-0 flex items-center justify-center">
      <div
        className={cn("relative overflow-hidden", className)}
        style={{
          aspectRatio: `${width} / ${height}`,
          width: frameSize ? `${frameSize.width}px` : undefined,
          height: frameSize ? `${frameSize.height}px` : undefined,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
