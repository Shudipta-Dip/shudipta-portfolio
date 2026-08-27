import { cn } from "@/lib/utils";
import { categoryIcons } from "@/lib/icons";
import type { Accent, Category, CoverShape } from "../../../content/projects";

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
  category,
  shape,
  className,
}: {
  accent: Accent;
  category: Category;
  shape: CoverShape;
  className?: string;
}) {
  const Icon = categoryIcons[category];

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
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(0,74,116,0.26))]" />
      <div className="absolute -right-10 -bottom-6 h-28 w-[120%] rotate-[-5deg] rounded-[50%] border-t border-white/50 bg-white/15 backdrop-blur-sm" />
      <div className="aero-app-icon absolute top-1/2 left-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-28">
        <Icon className="size-11 text-white drop-shadow-[0_3px_5px_rgba(0,69,105,0.35)] sm:size-13" strokeWidth={1.6} />
      </div>
      <div className="absolute top-5 left-5 h-1.5 w-16 rounded-full bg-white/55 blur-[1px]" />
      <div className="absolute top-9 left-5 h-1 w-9 rounded-full bg-white/35" />
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
