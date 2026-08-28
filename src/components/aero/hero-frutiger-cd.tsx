"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CD_SRC = "/Frutiger%20CD.svg";
const LISTENER_SRC = "/frutiger%20listener.svg";
const MUSIC_SRC = "/frutiger%20lease.mp3";

function FilledPauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="6" y="6" width="4" height="12" rx="0.75" fill="currentColor" />
      <rect x="14" y="6" width="4" height="12" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function HeroFrutigerCd({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-label={playing ? "Pause Frutiger music" : "Play Frutiger music"}
      aria-pressed={playing}
      className={cn(
        "group relative hidden shrink-0 cursor-pointer flex-col items-center gap-2 md:flex",
        className,
      )}
    >
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" />
      <div className="relative mr-2 mb-1 size-20 overflow-visible lg:size-24">
        <span
          aria-hidden
          className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgb(255_255_255/0.55),transparent_42%),radial-gradient(circle,rgb(72_202_228/0.22),rgb(13_59_74/0.12))] opacity-80 blur-md transition-opacity group-hover:opacity-100"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span
          className={cn(
            "relative z-10 block size-full",
            playing
              ? "aero-cd-spin motion-reduce:animate-none"
              : "transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none",
          )}
        >
          <img
            src={CD_SRC}
            alt=""
            draggable={false}
            className="size-full object-contain drop-shadow-[0_12px_20px_rgb(14_90_130/0.24)]"
          />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LISTENER_SRC}
          alt=""
          draggable={false}
          aria-hidden
          className="pointer-events-none absolute right-[-16%] bottom-[-10%] z-20 h-[48%] w-auto object-contain drop-shadow-[0_8px_14px_rgb(14_90_130/0.22)]"
        />
      </div>
      <span className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-sky-deep">
        {playing ? (
          <FilledPauseIcon className="size-[1em] shrink-0" />
        ) : (
          <Play className="size-[1em] shrink-0 fill-current" aria-hidden />
        )}
        Set the vibe
      </span>
    </button>
  );
}
