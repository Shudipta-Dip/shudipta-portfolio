"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

function markIfDecoded(img: HTMLImageElement | null, onReady: () => void) {
  if (img && img.complete && img.naturalWidth > 0) onReady();
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
  const posterRef = useRef<HTMLImageElement>(null);
  const indexRef = useRef(0);
  const startsRef = useRef<number[]>([0]);
  const seekingRef = useRef(false);
  const hoveringRef = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [posterReady, setPosterReady] = useState(!posterUrl);

  const markPosterReady = () => setPosterReady(true);

  useLayoutEffect(() => {
    if (!posterUrl) {
      setPosterReady(true);
      return;
    }

    // Reset, then recover immediately if the browser already has the poster
    // decoded (common with long-lived /media Cache-Control). Without this,
    // onLoad can fire before React attaches — or between render and effect —
    // and the skeleton stays forever.
    setPosterReady(false);
    markIfDecoded(posterRef.current, markPosterReady);

    const probe = new window.Image();
    probe.src = posterUrl;
    if (probe.complete && probe.naturalWidth > 0) {
      setPosterReady(true);
      return;
    }
    const onProbeLoad = () => setPosterReady(true);
    probe.addEventListener("load", onProbeLoad);
    probe.addEventListener("error", onProbeLoad);
    return () => {
      probe.removeEventListener("load", onProbeLoad);
      probe.removeEventListener("error", onProbeLoad);
    };
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
          ref={posterRef}
          src={posterUrl}
          alt=""
          aria-hidden
          decoding="async"
          loading="eager"
          className={cn(
            "absolute inset-0 z-10 block size-full object-contain transition-opacity duration-200",
            hovering ? "opacity-0" : posterReady ? "opacity-100" : "opacity-0",
          )}
          onLoad={markPosterReady}
          onError={markPosterReady}
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
        preload={hovering ? "auto" : "metadata"}
        disablePictureInPicture
      />
    </div>
  );
}
