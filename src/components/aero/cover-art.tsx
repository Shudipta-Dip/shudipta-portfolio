import { cn } from "@/lib/utils";
import type { Accent, CoverShape } from "../../../content/projects";
import { GlossyOrb } from "@/components/aero/scene";

const shapeClass: Record<CoverShape, string> = {
  landscape: "aspect-[16/10] min-h-[11rem]",
  portrait: "aspect-[4/5] min-h-[16rem]",
  square: "aspect-square min-h-[13rem]",
  tall: "aspect-[3/4] min-h-[18rem]",
};

const washes: Record<Accent, string> = {
  cyan: "from-[#7ad7f7] via-[#3eb7e4] to-[#1578a8]",
  lime: "from-[#dff58a] via-[#8ed63a] to-[#3f8f14]",
  aqua: "from-[#9af0e8] via-[#2ad4c9] to-[#0e7f8a]",
  meadow: "from-[#d4f7a0] via-[#7ed957] to-[#3d8c22]",
};

export function CoverArt({
  accent,
  shape,
  className,
}: {
  accent: Accent;
  shape: CoverShape;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-linear-to-br",
        washes[accent],
        shapeClass[shape],
        className,
      )}
    >
      <div className="caustics absolute inset-0 opacity-50" />
      <GlossyOrb
        className="absolute -top-6 -right-4 size-28 opacity-90"
        accent={accent}
      />
      <GlossyOrb
        className="absolute bottom-4 left-5 size-14 [animation-delay:1.2s]"
        accent={accent === "lime" || accent === "meadow" ? "cyan" : "lime"}
      />
      <GlossyOrb
        className="absolute top-1/2 right-1/3 size-8 opacity-70 [animation-delay:0.4s]"
        accent="aqua"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/15 to-transparent" />
    </div>
  );
}

export function MediaFrame({
  src,
  alt,
  kind,
  shape,
  className,
}: {
  src: string;
  alt: string;
  kind: "image" | "video";
  shape?: CoverShape;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-sky/30",
        shape ? shapeClass[shape] : "aspect-video",
        className,
      )}
    >
      {kind === "video" ? (
        <video
          src={src}
          className="size-full object-cover"
          muted
          playsInline
          loop
          preload="metadata"
        />
      ) : (
        // Dropped files are served from /media and can be any raster the user dumps.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      )}
    </div>
  );
}
