import { CodeXml, Globe, Leaf, Mail } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { profile } from "../../../content/profile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="glass-shell mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2 pl-1">
          <span className="aero-icon-lens aero-lens-lime flex size-8 shrink-0 items-center justify-center rounded-[0.7rem]">
            <Leaf className="size-4 text-white" strokeWidth={2} />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
            {profile.shortName}
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "nav-gem nav-gem-blue")}
          >
            <Globe />
            <span className="hidden sm:inline">LinkedIn</span>
            <span className="sr-only sm:hidden">LinkedIn</span>
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "nav-gem nav-gem-deep")}
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
