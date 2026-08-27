import { CodeXml, Droplets, Globe, Mail } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { profile } from "../../../content/profile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2 pl-1">
          <span className="orb orb-cyan size-8 shrink-0" />
          <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
            {profile.shortName}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/#work" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Work
          </Link>
          <Link href="/#about" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            About
          </Link>
        </nav>
        <div className="flex items-center gap-1.5">
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Globe />
            <span className="hidden sm:inline">LinkedIn</span>
            <span className="sr-only sm:hidden">LinkedIn</span>
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <CodeXml />
            <span className="hidden sm:inline">GitHub</span>
            <span className="sr-only sm:hidden">GitHub</span>
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className={cn(buttonVariants({ variant: "gel", size: "sm" }))}
          >
            <Mail />
            Say hello
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-4 pt-16 pb-10 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-[2rem] px-6 py-6 sm:flex-row">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Droplets className="size-4 text-sky-deep" />
          Frutiger Aero portfolio · v1
        </p>
        <p className="text-sm text-muted-foreground">
          {profile.name} · {profile.location}
        </p>
      </div>
    </footer>
  );
}
