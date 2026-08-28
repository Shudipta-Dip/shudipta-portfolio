"use client";

import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ProjectWithMedia } from "@/lib/portfolio";

import { type PanelState } from "./panel-toggle";
import { ScrollingModeSlide } from "./scrolling-mode-slide";

type ScrollingModeOverlayProps = {
  projects: ProjectWithMedia[];
  onClose: () => void;
};

export function ScrollingModeOverlay({ projects, onClose }: ScrollingModeOverlayProps) {
  const scrollableProjects = projects.filter((project) => project.media.cover);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getPanelState = useCallback(
    (slug: string): PanelState => panelStates[slug] ?? "default",
    [panelStates],
  );

  const setPanelState = useCallback((slug: string, state: PanelState) => {
    setPanelStates((current) => ({ ...current, [slug]: state }));
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("scrolling-mode-active");
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("scrolling-mode-active");
    };
  }, []);

  useEffect(() => {
    for (const project of scrollableProjects) {
      const cover = project.media.cover;
      if (cover?.kind !== "image") continue;
      const preload = new window.Image();
      preload.src = cover.url;
    }
  }, [scrollableProjects]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-slide-index"));
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      { root, threshold: 0.62 },
    );

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }

    return () => observer.disconnect();
  }, [scrollableProjects.length]);

  if (!scrollableProjects.length) return null;

  const advancePanel = (slug: string) => {
    const current = getPanelState(slug);
    if (current === "default") setPanelState(slug, "expanded");
    else if (current === "expanded") setPanelState(slug, "fullscreen");
  };

  const collapsePanel = (slug: string) => {
    setPanelState(slug, "default");
  };

  const hasAnyVideo = scrollableProjects.some((project) => project.media.cover?.kind === "video");

  return (
    <div className="fixed inset-0 z-[120] bg-black">
      <button
        type="button"
        onClick={onClose}
        aria-label="Back to board"
        className="reels-glass-control absolute top-4 left-4 z-[130] flex size-11 items-center justify-center rounded-full text-white transition-[transform,box-shadow] duration-200 active:scale-95 md:top-6 md:left-6 md:size-12 lg:size-14"
      >
        <ArrowLeft className="size-5" strokeWidth={2.2} />
      </button>

      {hasAnyVideo ? (
        <button
          type="button"
          onClick={() => setSoundEnabled((current) => !current)}
          aria-label={soundEnabled ? "Mute videos" : "Unmute videos"}
          aria-pressed={soundEnabled}
          className="reels-glass-control absolute top-4 right-4 z-[130] flex size-11 items-center justify-center rounded-full text-white transition-[transform,box-shadow] duration-200 active:scale-95 md:top-6 md:right-6 md:size-12 lg:size-14"
        >
          {soundEnabled ? (
            <Volume2 className="size-5" strokeWidth={2.2} />
          ) : (
            <VolumeX className="size-5" strokeWidth={2.2} />
          )}
        </button>
      ) : null}

      <div
        ref={containerRef}
        className="h-[100dvh] overflow-y-auto overscroll-y-contain snap-y snap-mandatory scroll-smooth"
      >
        {scrollableProjects.map((project, index) => (
          <div
            key={project.slug}
            ref={(node) => {
              slideRefs.current[index] = node;
            }}
            data-slide-index={index}
          >
            <ScrollingModeSlide
              project={project}
              isActive={activeIndex === index}
              panelState={getPanelState(project.slug)}
              soundEnabled={soundEnabled}
              onPanelAdvance={() => advancePanel(project.slug)}
              onPanelCollapse={() => collapsePanel(project.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
