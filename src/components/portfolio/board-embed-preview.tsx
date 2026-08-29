"use client";

import { useEffect, useRef, useState } from "react";

import { CoverArt } from "@/components/aero/cover-art";
import { MediaSkeleton } from "@/components/portfolio/media-skeleton";
import { ProjectEmbed } from "@/components/portfolio/project-embed";
import { cn } from "@/lib/utils";
import type { Accent, Category, CoverShape } from "../../../content/projects";

const SCROLL_IDLE_MS = 320;
const MIN_VISIBLE_RATIO = 0.12;

type BoardEmbedPreviewProps = {
  url: string;
  title: string;
  accent: Accent;
  category: Category;
  shape?: CoverShape;
  className?: string;
};

export function BoardEmbedPreview({
  url,
  title,
  accent,
  category,
  shape = "landscape",
  className,
}: BoardEmbedPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const loadedRef = useRef(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const mountEmbed = () => {
      if (loadedRef.current || !visibleRef.current) return;

      loadedRef.current = true;
      const scrollY = window.scrollY;

      setShowEmbed(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (Math.abs(window.scrollY - scrollY) > 6) {
            window.scrollTo({ top: scrollY, behavior: "instant" });
          }
        });
      });
    };

    const scheduleLoad = () => {
      if (loadedRef.current) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(mountEmbed, SCROLL_IDLE_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current =
          entry.isIntersecting && entry.intersectionRatio >= MIN_VISIBLE_RATIO;
        if (visibleRef.current) scheduleLoad();
      },
      { threshold: [0, MIN_VISIBLE_RATIO, 0.35], rootMargin: "64px 0px" },
    );

    observer.observe(root);
    window.addEventListener("scroll", scheduleLoad, { passive: true });
    window.addEventListener("wheel", scheduleLoad, { passive: true });
    window.addEventListener("touchmove", scheduleLoad, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleLoad);
      window.removeEventListener("wheel", scheduleLoad);
      window.removeEventListener("touchmove", scheduleLoad);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-[#0a1620] [overflow-anchor:none]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          showEmbed && embedReady ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden={showEmbed && embedReady}
      >
        <CoverArt
          accent={accent}
          category={category}
          shape={shape}
          className="!aspect-auto size-full min-h-0"
        />
        {showEmbed && !embedReady ? <MediaSkeleton tone="card" className="z-10" /> : null}
      </div>
      {showEmbed ? (
        <ProjectEmbed
          url={url}
          title={title}
          loading="eager"
          className={cn(
            "pointer-events-none absolute inset-0 h-full min-h-full scale-[1.02] transition-opacity duration-300",
            embedReady ? "opacity-95" : "opacity-0",
          )}
          onLoad={() => setEmbedReady(true)}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a1620]/55 via-transparent to-transparent" />
    </div>
  );
}
