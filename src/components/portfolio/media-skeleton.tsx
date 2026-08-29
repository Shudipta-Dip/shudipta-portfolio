import { cn } from "@/lib/utils";

type MediaSkeletonProps = {
  className?: string;
  /** Soft shimmer over stage gradient (reels) vs solid card placeholder (board). */
  tone?: "stage" | "card";
};

export function MediaSkeleton({ className, tone = "card" }: MediaSkeletonProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        tone === "stage" ? "media-skeleton-stage" : "media-skeleton-card",
        className,
      )}
      aria-hidden
    >
      <div className="media-skeleton-shimmer absolute inset-0" />
    </div>
  );
}
