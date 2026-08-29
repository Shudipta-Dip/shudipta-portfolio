"use client";

import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Category } from "../../../../content/projects";
import type { ProjectWithMedia } from "@/lib/portfolio";

import { ScrollingModeCatchUp } from "./scrolling-mode-catch-up";
import { type PanelState } from "./panel-toggle";
import { ScrollingModeSlide } from "./scrolling-mode-slide";

type ScrollingModeOverlayProps = {
  projects: ProjectWithMedia[];
  allProjects: ProjectWithMedia[];
  onClose: () => void;
  onBrowseCategory: (category: Category) => void;
};

export function ScrollingModeOverlay({
  projects,
  allProjects,
  onClose,
  onBrowseCategory,
}: ScrollingModeOverlayProps) {
  const scrollableProjects = projects.filter((project) => project.media.cover);
  const slideCount = scrollableProjects.length + 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelStates, setPanelStates] = useState<Record<string, PanelState>>({});
  const [soundEnabled, setSoundEnabled] = useState(false);

  const getPanelState = useCallback(
    (slug: string): PanelState => panelStates[slug] ?? "default",
    [panelStates],
  );

  const setPanelState = useCallback((slug: string, state: PanelState) => {
    setPanelStates((current) => ({ ...current, [slug]: state }));
  }, []);

  useEffect(() => {
    if (!scrollableProjects.length) return;

    const scrollY = window.scrollY;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const previousBodyStyles = {
      position: bodyStyle.position,
      top: bodyStyle.top,
      left: bodyStyle.left,
      right: bodyStyle.right,
      width: bodyStyle.width,
      overflow: bodyStyle.overflow,
    };
    const previousHtmlOverflow = htmlStyle.overflow;

    htmlStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    document.body.classList.add("scrolling-mode-active");

    return () => {
      bodyStyle.position = previousBodyStyles.position;
      bodyStyle.top = previousBodyStyles.top;
      bodyStyle.left = previousBodyStyles.left;
      bodyStyle.right = previousBodyStyles.right;
      bodyStyle.width = previousBodyStyles.width;
      bodyStyle.overflow = previousBodyStyles.overflow;
      htmlStyle.overflow = previousHtmlOverflow;
      document.body.classList.remove("scrolling-mode-active");
      window.scrollTo(0, scrollY);
    };
  }, [scrollableProjects.length]);

  useEffect(() => {
    const warmAround = [
      activeIndex - 2,
      activeIndex - 1,
      activeIndex,
      activeIndex + 1,
      activeIndex + 2,
      activeIndex + 3,
    ];

    for (const index of warmAround) {
      const project = scrollableProjects[index];
      const cover = project?.media.cover;
      if (!cover) continue;

      if (cover.kind === "image") {
        const preload = new window.Image();
        preload.decoding = "async";
        preload.src = cover.url;
        continue;
      }

      if (cover.posterUrl) {
        const poster = new window.Image();
        poster.decoding = "async";
        poster.src = cover.posterUrl;
      }
    }
  }, [activeIndex, scrollableProjects]);

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
  }, [slideCount]);

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
    <div className="fixed inset-0 z-[120] overflow-hidden bg-[#0d3b4a]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Back to board"
        className="reels-glass-control absolute top-[calc(1rem+env(safe-area-inset-top))] left-[calc(1rem+env(safe-area-inset-left))] z-[130] flex size-11 touch-manipulation items-center justify-center rounded-full text-white transition-[transform,box-shadow] duration-200 active:scale-95 md:top-6 md:left-6 md:size-12 lg:size-14"
      >
        <ArrowLeft className="size-5" strokeWidth={2.2} />
      </button>

      {hasAnyVideo ? (
        <button
          type="button"
          onClick={() => setSoundEnabled((current) => !current)}
          aria-label={soundEnabled ? "Mute videos" : "Unmute videos"}
          aria-pressed={soundEnabled}
          className="reels-glass-control absolute top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] z-[130] flex size-11 touch-manipulation items-center justify-center rounded-full text-white transition-[transform,box-shadow] duration-200 active:scale-95 md:top-6 md:right-6 md:size-12 lg:size-14"
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
        className="reels-stage-bg h-[100dvh] touch-pan-y overflow-y-auto overscroll-none snap-y snap-mandatory [-webkit-overflow-scrolling:touch]"
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
              isNearby={Math.abs(activeIndex - index) <= 2}
              panelState={getPanelState(project.slug)}
              soundEnabled={soundEnabled}
              onPanelAdvance={() => advancePanel(project.slug)}
              onPanelCollapse={() => collapsePanel(project.slug)}
            />
          </div>
        ))}
        <div
          ref={(node) => {
            slideRefs.current[scrollableProjects.length] = node;
          }}
          data-slide-index={scrollableProjects.length}
        >
          <ScrollingModeCatchUp projects={allProjects} onBrowseCategory={onBrowseCategory} />
        </div>
      </div>
    </div>
  );
}
