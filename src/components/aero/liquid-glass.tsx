"use client";

import { type CSSProperties, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

type LiquidGlassProps = {
  width?: number;
  height?: number;
  borderRadius?: number;
  tintOpacity?: number;
  blur?: number;
  filterId?: string;
};

export function LiquidGlass({
  width = 120,
  height = 120,
  borderRadius = 12,
  tintOpacity = 0.1,
  blur = 2,
  filterId = "bubble-glass-distortion",
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const glass = glassRef.current;
    const parent = glass?.parentElement;

    if (!glass || !parent) return;

    gsap.set(glass, { opacity: 0 });

    const mouseMove = (e: MouseEvent) => {
      if (!glassRef.current) return;

      const parentRect = parent.getBoundingClientRect();
      const posX = e.clientX - parentRect.left - width / 2;
      const posY = e.clientY - parentRect.top - height / 2;

      gsap.to(glassRef.current, {
        duration: 0.6,
        left: posX,
        top: posY,
        opacity: 1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [width, height]);

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        className="absolute overflow-hidden"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.008"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="80"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={glassRef}
        className={cn(
          "absolute isolate z-[1] rounded-(--lg-border-radius) shadow-lg",
          "before:absolute before:inset-0 before:z-0 before:rounded-(--lg-border-radius) before:bg-[rgba(255,255,255,var(--lg-tint-opacity))] before:shadow-[inset_0_0_20px_-5px_rgba(255,255,255,0.7)] before:content-['']",
          "after:absolute after:inset-0 after:isolate after:-z-[1] after:rounded-(--lg-border-radius) after:[filter:var(--lg-filter)] after:backdrop-blur-[var(--lg-blur)] after:content-['']",
        )}
        style={
          {
            "--lg-border-radius": `${borderRadius}px`,
            "--lg-tint-opacity": tintOpacity,
            "--lg-blur": `${blur}px`,
            "--lg-filter": `url(#${filterId})`,
            width,
            height,
          } as CSSProperties
        }
      />
    </>
  );
}
