"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { IntakeChipRow, MetaChipRow } from "@/components/portfolio/contribution-chip";
import { ProjectEmbed } from "@/components/portfolio/project-embed";
import type { ProjectWithMedia } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

import { FullscreenLineToggle, PanelToggle, type PanelState } from "./panel-toggle";
import { ReelsContentShell } from "./reels-content-shell";

type ScrollingModeSlideProps = {
  project: ProjectWithMedia;
  isActive: boolean;
  panelState: PanelState;
  soundEnabled: boolean;
  onPanelAdvance: () => void;
  onPanelCollapse: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

const panelToggleClass =
  "absolute right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[130] mb-0 md:right-5 md:bottom-7 lg:right-6 lg:bottom-8";

const metadataPanelClass =
  "absolute inset-x-0 bottom-0 z-20 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pr-[3.75rem] md:pr-[4.5rem] lg:pr-20";

export function ScrollingModeSlide({
  project,
  isActive,
  panelState,
  soundEnabled,
  onPanelAdvance,
  onPanelCollapse,
}: ScrollingModeSlideProps) {
  const cover = project.media.cover;
  const isEmbed = project.isEmbed && project.embedUrl;
  const frameWidth = cover?.width ?? 1280;
  const frameHeight = cover?.height ?? 800;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(cover?.duration ?? 0);
  const [isPaused, setIsPaused] = useState(false);
  const isVideo = cover?.kind === "video";
  const isVertical = cover ? cover.height / cover.width >= 1.02 : false;
  const showMetadata = panelState !== "fullscreen";
  const showExpanded = panelState === "expanded";
  const needsReadabilityFade =
    showMetadata && isVertical && (panelState === "default" || panelState === "expanded");

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isVideo || !isActive) return;

    if (video.paused) {
      setIsPaused(false);
      void video.play().catch(() => {});
      return;
    }

    setIsPaused(true);
    video.pause();
  }, [isActive, isVideo]);

  useEffect(() => {
    if (!isActive) setIsPaused(false);
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    video.muted = !soundEnabled;

    if (!isActive) {
      video.pause();
      video.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (isPaused) {
      video.pause();
      return;
    }

    void video.play().catch(() => {});
  }, [isActive, isVideo, soundEnabled, isPaused]);

  useEffect(() => {
    if (!isActive || !isVideo) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.key !== " ") return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;

      event.preventDefault();
      togglePlayback();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, isVideo, togglePlayback]);

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  if (!cover && !isEmbed) return null;

  return (
    <section className="reels-slide relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden">
      <div className="reels-stage-bg absolute inset-0" />

      <ReelsContentShell width={frameWidth} height={frameHeight}>
        <div
          className={cn("absolute inset-0", isVideo && isActive && "cursor-pointer")}
          onClick={isVideo && isActive ? togglePlayback : undefined}
          onKeyDown={
            isVideo && isActive
              ? (event) => {
                  if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    togglePlayback();
                  }
                }
              : undefined
          }
          role={isVideo && isActive ? "button" : undefined}
          tabIndex={isVideo && isActive ? -1 : undefined}
          aria-label={isVideo && isActive ? (isPaused ? "Play video" : "Pause video") : undefined}
        >
          {isEmbed ? (
            <ProjectEmbed
              url={project.embedUrl!}
              title={project.title}
              className="size-full bg-white"
            />
          ) : isVideo ? (
            <video
              ref={videoRef}
              src={cover!.url}
              poster={cover!.posterUrl}
              playsInline
              muted
              loop
              preload={isActive ? "auto" : "metadata"}
              width={cover!.width}
              height={cover!.height}
              className="pointer-events-none block size-full object-contain"
              onLoadedMetadata={(event) => {
                const total = event.currentTarget.duration;
                if (Number.isFinite(total)) setDuration(total);
              }}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            />
          ) : (
            // Native img: Next/Image lazy loading breaks inside the reels scroll container.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover!.url}
              alt={project.title}
              width={cover!.width}
              height={cover!.height}
              loading="eager"
              decoding="async"
              className="block size-full object-contain"
            />
          )}
        </div>
      </ReelsContentShell>

      {showMetadata ? (
        <>
          {needsReadabilityFade ? (
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%]",
                showExpanded ? "reels-readability-fade-expanded" : "reels-readability-fade",
              )}
            />
          ) : (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t from-black/45 to-transparent" />
          )}

          <div className={metadataPanelClass}>
            <div className="min-w-0 space-y-2.5">
              <h2 className="font-heading text-lg font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgb(0_0_0/0.45)]">
                {project.title}
              </h2>
              {showExpanded ? (
                <p className="max-w-[min(100%,20rem)] text-sm leading-relaxed text-white/88 drop-shadow-[0_1px_6px_rgb(0_0_0/0.45)]">
                  {project.tagline}
                </p>
              ) : null}
              <IntakeChipRow labels={project.displayContributions} />
              {showExpanded ? (
                <MetaChipRow
                  contentType={project.displayContentType}
                  organization={project.org}
                  year={project.year}
                />
              ) : null}
              {isVideo ? (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.05}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => handleSeek(Number(event.target.value))}
                    aria-label={`Seek ${project.title}`}
                    className="reels-scrubber w-full"
                  />
                  <div className="flex w-full justify-between text-[0.65rem] font-semibold tracking-wide text-white/70 uppercase">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <PanelToggle
            state={panelState}
            onAdvance={onPanelAdvance}
            className={panelToggleClass}
          />
        </>
      ) : (
        <FullscreenLineToggle onClick={onPanelCollapse} className={panelToggleClass} />
      )}
    </section>
  );
}
