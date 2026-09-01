"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CD_SRC = "/art%20deco%20cd.svg";
const CANDLE_SRC = "/art%20deco%20candle.svg";
const MUSIC_SRC = "/art%20deco%20music.mp3";

function FilledPauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="6" y="6" width="4" height="12" rx="0.75" fill="currentColor" />
      <rect x="14" y="6" width="4" height="12" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function HeroArtDecoCd({ className }: { className?: string }) {
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
      aria-label={playing ? "Pause Art Deco music" : "Play Art Deco music"}
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
          className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgb(241_201_112/0.42),transparent_42%),radial-gradient(circle,rgb(212_175_55/0.16),rgb(12_10_8/0.2))] opacity-80 blur-md transition-opacity group-hover:opacity-100"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span
          className={cn(
            "relative z-10 block size-full origin-center scale-[1.18]",
            playing
              ? "aero-cd-spin motion-reduce:animate-none"
              : "transition-transform duration-300 group-hover:scale-[1.22] motion-reduce:transition-none",
          )}
        >
          <img
            src={CD_SRC}
            alt=""
            draggable={false}
            className="size-full object-contain drop-shadow-[0_12px_24px_rgb(212_175_55/0.22)]"
          />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CANDLE_SRC}
          alt=""
          draggable={false}
          aria-hidden
          className="pointer-events-none absolute bottom-[-18%] right-[-22%] z-20 h-[72%] w-auto object-contain drop-shadow-[0_8px_18px_rgb(212_175_55/0.28)]"
        />
      </div>
      <span className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-sky-deep uppercase">
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
