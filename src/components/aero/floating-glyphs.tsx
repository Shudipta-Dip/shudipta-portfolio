"use client";

import { useEffect, useState } from "react";

const GLYPH_SIZE = "w-[400px] max-w-[92vw]";

const FLOATING_GLYPHS = [
  {
    src: "/16.svg",
    placement: `top-[2%] left-[-8%] ${GLYPH_SIZE} md:top-[0%] md:left-[-5%]`,
    rotate: -12,
    blur: 6,
    opacity: 0.72,
    duration: "7.4s",
    delay: "0s",
  },
  {
    src: "/17.svg",
    placement: `top-[10%] right-[-10%] ${GLYPH_SIZE} md:top-[1%] md:right-[-5%]`,
    rotate: 10,
    blur: 8,
    opacity: 0.68,
    duration: "8.8s",
    delay: "1.6s",
  },
  {
    src: "/18.svg",
    placement: `top-[28%] left-[-4%] ${GLYPH_SIZE} md:top-[58%] md:left-[-4%]`,
    rotate: -6,
    blur: 7,
    opacity: 0.7,
    duration: "6.6s",
    delay: "2.9s",
  },
  {
    src: "/19.svg",
    placement: `top-[42%] right-[-6%] ${GLYPH_SIZE} md:top-[55%] md:right-[-4%]`,
    rotate: 15,
    blur: 8,
    opacity: 0.66,
    duration: "9.2s",
    delay: "0.8s",
  },
] as const;

export function FloatingGlyphs() {
  const [showGlyphs, setShowGlyphs] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setShowGlyphs(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!showGlyphs) return null;

  return (
    <div className="aero-floating-glyphs pointer-events-none absolute inset-0">
      {FLOATING_GLYPHS.map((glyph) => (
        <div
          key={glyph.src}
          className={`aero-floating-glyph absolute ${glyph.placement}`}
          style={{
            rotate: `${glyph.rotate}deg`,
          }}
        >
          <div
            className="aero-floating-glyph-inner motion-reduce:animate-none"
            style={{
              filter: `blur(${glyph.blur}px) saturate(1.35) contrast(1.06)`,
              opacity: glyph.opacity,
              animationDuration: glyph.duration,
              animationDelay: glyph.delay,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={glyph.src} alt="" aria-hidden className="aero-floating-glyph-art" draggable={false} />
          </div>
        </div>
      ))}
    </div>
  );
}
