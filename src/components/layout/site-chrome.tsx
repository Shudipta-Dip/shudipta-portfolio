import { Mail } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { GithubIcon, LinkedinIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";
import { profile } from "../../../content/profile";

export function SiteHeader() {
  return (
    <header className="relative sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <div
        className={cn(
          "site-header-bar glass-shell mx-auto flex w-full max-w-[90rem] items-center justify-between gap-2 rounded-2xl px-2.5 py-2 sm:gap-3 sm:rounded-full sm:px-4",
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2 pl-0.5 sm:pl-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="size-8 shrink-0" />
          <span
            className="font-heading truncate text-sm font-semibold tracking-tight max-[360px]:max-w-[5.5rem] max-[420px]:max-w-[7rem] sm:max-w-none sm:text-base"
          >
            {profile.shortName}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <ThemeSwitcher />
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "nav-gem nav-gem-blue sm:h-8 sm:w-auto sm:px-3",
            )}
          >
            <LinkedinIcon strokeWidth={1.8} />
            <span className="hidden sm:inline">LinkedIn</span>
            <span className="sr-only sm:hidden">LinkedIn</span>
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "nav-gem nav-gem-deep sm:h-8 sm:w-auto sm:px-3",
            )}
          >
            <GithubIcon strokeWidth={1.8} />
            <span className="hidden sm:inline">GitHub</span>
            <span className="sr-only sm:hidden">GitHub</span>
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className={cn(
              buttonVariants({ variant: "gel", size: "sm" }),
              "shrink-0 px-2.5 sm:px-3",
            )}
          >
            <Mail />
            <span className="sm:hidden">Hello</span>
            <span className="hidden sm:inline">Say hello</span>
          </a>
        </div>
      </div>
    </header>
  );
}
