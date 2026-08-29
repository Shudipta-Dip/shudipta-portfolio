"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ReelsContentShellProps = {
  children: React.ReactNode;
} & Pick<ComponentPropsWithoutRef<"div">, "className">;

/**
 * Full-stage letterbox shell. Media should use object-contain so the
 * Frutiger gradient shows in unused regions — no ResizeObserver / cqw sizing.
 */
export function ReelsContentShell({ className, children }: ReelsContentShellProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>{children}</div>
  );
}
