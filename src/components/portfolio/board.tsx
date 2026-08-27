"use client";

import { useMemo, useState } from "react";
import {
  AppWindow,
  ChartColumn,
  Clapperboard,
  LayoutGrid,
  MapPin,
  Palette,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryMeta, type Category } from "../../../content/projects";
import { profile } from "../../../content/profile";
import type { ProjectWithMedia } from "@/lib/portfolio";
import { ProjectCard } from "@/components/portfolio/project-card";
import { cn } from "@/lib/utils";

const filters: {
  id: "all" | Category;
  label: string;
  icon: typeof Palette;
  tone: string;
}[] = [
  { id: "all", label: "All work", icon: LayoutGrid, tone: "aero-shortcut-blue" },
  { id: "design", label: categoryMeta.design.label, icon: Palette, tone: "aero-shortcut-lime" },
  { id: "reels", label: categoryMeta.reels.label, icon: Clapperboard, tone: "aero-shortcut-aqua" },
  { id: "product", label: categoryMeta.product.label, icon: AppWindow, tone: "aero-shortcut-sun" },
  { id: "data", label: categoryMeta.data.label, icon: ChartColumn, tone: "aero-shortcut-deep" },
];

function countForFilter(projects: ProjectWithMedia[], id: "all" | Category) {
  if (id === "all") return projects.length;
  return projects.filter((project) => project.categories.includes(id)).length;
}

export function PortfolioBoard({ projects }: { projects: ProjectWithMedia[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) => project.categories.includes(active));
  }, [active, projects]);

  return (
    <section id="work" className="mx-auto max-w-[90rem] px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
      <div className="glass-panel mb-5 overflow-hidden rounded-[2rem]">
        <div className="px-5 py-6 sm:px-7">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-sky-deep uppercase">
              <MapPin className="size-3.5" />
              {profile.location} · Creative + data
            </p>
            <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {profile.headline}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const selected = active === filter.id;
            const count = countForFilter(projects, filter.id);
            return (
              <Button
                key={filter.id}
                variant="ghost"
                onClick={() => setActive(filter.id)}
                aria-pressed={selected}
                className={cn(
                  "aero-shortcut h-auto min-h-21 justify-start gap-3 rounded-[1.35rem] px-3 py-3 text-left",
                  filter.tone,
                  selected && "aero-shortcut-active",
                )}
              >
                <span className="aero-shortcut-icon flex size-11 shrink-0 items-center justify-center rounded-[1rem]">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold">{filter.label}</span>
                  <span className="mt-0.5 block text-[0.65rem] font-semibold tracking-wider opacity-65 uppercase">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </span>
              </Button>
            );
          })}
      </div>
      <div className="columns-[17rem] gap-4">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
