import { ArrowDownRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { GlossyOrb } from "@/components/aero/scene";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DropFile } from "@/lib/drop";
import { profile } from "../../../content/profile";

export function Hero({ portrait }: { portrait?: DropFile }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
      <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
        <GlossyOrb className="absolute -top-8 -right-6 size-28 opacity-80" accent="cyan" />
        <GlossyOrb className="absolute -bottom-10 left-10 size-16 opacity-70 [animation-delay:1s]" accent="lime" />
        <p className="relative text-xs font-semibold tracking-[0.22em] text-sky-deep uppercase">
          {profile.location} · {profile.school}
        </p>
        <h1 className="font-heading relative mt-3 max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          {profile.name}
        </h1>
        <p className="relative mt-4 max-w-xl text-lg font-medium text-sky-deep sm:text-xl">
          {profile.role}
        </p>
        <p className="relative mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {profile.headline}
        </p>
        <div className="relative mt-7 flex flex-wrap gap-3">
          <Link href="/#work" className={cn(buttonVariants({ variant: "gel", size: "lg" }))}>
            <Sparkles />
            See the work
          </Link>
          <Link href="/#about" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            <ArrowDownRight />
            How I work
          </Link>
        </div>
      </div>

      <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
        <GlossyOrb className="absolute size-[92%] opacity-90" accent="aqua" />
        <GlossyOrb className="absolute -top-4 right-6 size-16 [animation-delay:0.8s]" accent="lime" />
        <GlossyOrb className="absolute bottom-2 left-4 size-12 [animation-delay:1.6s]" accent="cyan" />
        <div className="relative z-10 flex size-[68%] items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md">
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portrait.url} alt={profile.name} className="size-full object-cover" />
          ) : (
            <span className="font-heading text-6xl font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,60,90,0.35)]">
              {profile.initials}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export function AboutBand() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="glass-panel grid gap-8 rounded-[2rem] px-6 py-8 sm:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-sky-deep uppercase">About</p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight">Craft, then receipts.</h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>{profile.summary}</p>
          <p>{profile.now}</p>
        </div>
      </div>
    </section>
  );
}
