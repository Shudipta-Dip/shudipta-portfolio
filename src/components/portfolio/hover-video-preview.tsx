"use client";

import { useEffect, useRef, useState } from "react";

import { MediaSkeleton } from "@/components/portfolio/media-skeleton";
import { cn } from "@/lib/utils";

function snippetStarts(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return [0];
  const count = duration < 2.4 ? 2 : duration < 5 ? 3 : 4;
  const length = Math.min(1, duration / count);
  return Array.from({ length: count }, (_, index) => {
    const center = ((index + 1) / (count + 1)) * duration;
    return Math.max(0, Math.min(Math.max(duration - length, 0), center - length / 2));
  });
}

export function HoverVideoPreview({
  src,
  posterUrl,
  width,
  height,
  duration,
  className,
}: {
  src: string;
  posterUrl?: string;
  width: number;
  height: number;
  duration?: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const indexRef = useRef(0);
  const startsRef = useRef<number[]>([0]);
  const seekingRef = useRef(false);
  const hoveringRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [posterReady, setPosterReady] = useState(!posterUrl);

  useEffect(() => {
    setPosterReady(!posterUrl);
  }, [posterUrl, src]);

  useEffect(() => {
    hoveringRef.current = hovering;
    const video = videoRef.current;
    if (!video) return;

    if (!hovering) {
      seekingRef.current = false;
      video.pause();
      return;
    }

    const length = 1;

    const jumpTo = (index: number) => {
      if (!hoveringRef.current) return;
      const points = startsRef.current;
      const next = ((index % points.length) + points.length) % points.length;
      indexRef.current = next;
      const target = points[next] ?? 0;
      seekingRef.current = true;
      video.currentTime = target;
      if (Math.abs(video.currentTime - target) < 0.08) {
        seekingRef.current = false;
        void video.play().catch(() => {});
      }
    };

    const begin = () => {
      const total = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : duration ?? 0;
      const points = snippetStarts(total);
      startsRef.current = points;
      indexRef.current = 0;
      jumpTo(0);
    };

    const onSeeked = () => {
      seekingRef.current = false;
      if (!hoveringRef.current) return;
      void video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (!hoveringRef.current || seekingRef.current) return;
      const start = startsRef.current[indexRef.current] ?? 0;
      if (video.currentTime >= start + length || video.ended) {
        jumpTo(indexRef.current + 1);
      }
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeUpdate);

    if (video.readyState >= 1) begin();
    else video.addEventListener("loadedmetadata", begin, { once: true });

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", begin);
    };
  }, [duration, hovering]);

  return (
    <div
      className={cn("relative overflow-hidden bg-[#0a1620]", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovering(true);
      }}
      onPointerLeave={() => setHovering(false)}
    >
      {!posterReady ? <MediaSkeleton tone="card" className="z-20" /> : null}
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt=""
          aria-hidden
          decoding="async"
          loading="lazy"
          className={cn(
            "absolute inset-0 z-10 block size-full object-contain transition-opacity duration-200",
            hovering ? "opacity-0" : posterReady ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setPosterReady(true)}
          onError={() => setPosterReady(true)}
        />
      ) : null}
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl}
        width={width}
        height={height}
        className={cn(
          "relative z-0 block size-full object-contain transition-opacity duration-200",
          hovering || !posterUrl ? "opacity-100" : "opacity-0",
        )}
        muted
        playsInline
        preload={hovering ? "auto" : "none"}
        disablePictureInPicture
      />
    </div>
  );
}
