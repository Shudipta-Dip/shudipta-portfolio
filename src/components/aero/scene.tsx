import { cn } from "@/lib/utils";

export function GlossyOrb({
  className,
  accent = "cyan",
}: {
  className?: string;
  accent?: "cyan" | "lime" | "aqua" | "meadow";
}) {
  return (
    <span
      className={cn("orb animate-float block", `orb-${accent}`, className)}
      aria-hidden
    />
  );
}

export function AeroScene() {
  return (
    <div className="sky-meadow pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="caustics absolute inset-0 opacity-70" />
      <div className="hills absolute inset-x-0 bottom-0 h-[28vh] opacity-90" />

      <div className="pointer-events-none absolute top-[-6rem] right-[8%] size-[22rem] rounded-full bg-[radial-gradient(circle_at_45%_45%,#fffce8_0%,#ffe27a_28%,#ffd36a_40%,transparent_62%)] opacity-80 blur-[2px]" />

      <div className="animate-drift absolute top-[12%] left-[8%] h-16 w-44 rounded-full bg-white/45 blur-md" />
      <div className="animate-drift absolute top-[18%] left-[18%] h-12 w-32 rounded-full bg-white/35 blur-md [animation-delay:1.5s]" />
      <div className="animate-drift absolute top-[10%] right-[28%] h-14 w-40 rounded-full bg-white/40 blur-md [animation-delay:2.2s]" />

      <GlossyOrb className="absolute top-[22%] right-[12%] size-24" accent="cyan" />
      <GlossyOrb
        className="animate-float-slow absolute top-[38%] left-[6%] size-16 [animation-delay:1s]"
        accent="aqua"
      />
      <GlossyOrb
        className="absolute right-[6%] bottom-[22%] size-20 [animation-delay:2s]"
        accent="lime"
      />
      <GlossyOrb
        className="animate-float-slow absolute bottom-[18%] left-[28%] size-10 [animation-delay:0.6s]"
        accent="meadow"
      />
      <GlossyOrb
        className="absolute top-[48%] right-[30%] size-8 opacity-80 [animation-delay:1.8s]"
        accent="cyan"
      />
    </div>
  );
}
