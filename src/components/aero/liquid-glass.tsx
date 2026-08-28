"use client";

import { type CSSProperties, type RefObject, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

type LiquidGlassProps = {
  morphTargetRef: RefObject<number>;
  fullSize?: number;
  compactSize?: number;
  filterId?: string;
};

function applyMorphStyles(
  element: HTMLElement,
  morph: number,
  fullSize: number,
  compactSize: number,
) {
  const size = fullSize + (compactSize - fullSize) * morph;
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.setProperty("--lg-border-radius", `${size / 2}px`);
  element.style.setProperty("--lg-tint-opacity", String(0.12 + (0.1 - 0.12) * morph));
  element.style.setProperty("--lg-blur", `${3 + (2 - 3) * morph}px`);
}

export function LiquidGlass({
  morphTargetRef,
  fullSize = 88,
  compactSize = Math.round(88 / 3),
  filterId = "bubble-glass-distortion",
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);
  const morphStateRef = useRef({ value: 0 });

  useGSAP(() => {
    const glass = glassRef.current;
    if (!glass) return;

    gsap.set(glass, { opacity: 0, xPercent: -50, yPercent: -50 });
    applyMorphStyles(glass, morphStateRef.current.value, fullSize, compactSize);

    const morphTo = gsap.quickTo(morphStateRef.current, "value", {
      duration: 0.2,
      ease: "power1.out",
      onUpdate: () => {
        if (!glassRef.current) return;
        applyMorphStyles(
          glassRef.current,
          morphStateRef.current.value,
          fullSize,
          compactSize,
        );
      },
    });

    const moveX = gsap.quickTo(glass, "x", { duration: 0.28, ease: "power2.out" });
    const moveY = gsap.quickTo(glass, "y", { duration: 0.28, ease: "power2.out" });
    const fadeIn = gsap.to(glass, { opacity: 1, duration: 0.3, ease: "power2.out" });

    const mouseMove = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const syncMorph = () => {
      morphTo(morphTargetRef.current ?? 0);
    };

    gsap.ticker.add(syncMorph);
    window.addEventListener("mousemove", mouseMove, { passive: true });

    return () => {
      gsap.ticker.remove(syncMorph);
      window.removeEventListener("mousemove", mouseMove);
      fadeIn.kill();
    };
  }, [compactSize, fullSize, morphTargetRef]);

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
          "absolute isolate z-[1] rounded-(--lg-border-radius) shadow-lg will-change-[transform,width,height]",
          "before:absolute before:inset-0 before:z-0 before:rounded-(--lg-border-radius) before:bg-[rgba(255,255,255,var(--lg-tint-opacity))] before:shadow-[inset_0_0_20px_-5px_rgba(255,255,255,0.7)] before:content-['']",
          "after:absolute after:inset-0 after:isolate after:-z-[1] after:rounded-(--lg-border-radius) after:[filter:var(--lg-filter)] after:backdrop-blur-[var(--lg-blur)] after:content-['']",
        )}
        style={
          {
            "--lg-border-radius": `${fullSize / 2}px`,
            "--lg-tint-opacity": 0.12,
            "--lg-blur": "3px",
            "--lg-filter": `url(#${filterId})`,
            width: fullSize,
            height: fullSize,
          } as CSSProperties
        }
      />
    </>
  );
}
