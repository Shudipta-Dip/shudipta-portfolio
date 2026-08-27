"use client";

import { useMemo, useState } from "react";
import { ChartColumn, Clapperboard, LayoutGrid, Palette, AppWindow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryMeta, type Category } from "../../../content/projects";
import type { ProjectWithMedia } from "@/lib/portfolio";
import { ProjectCard } from "@/components/portfolio/project-card";

const filters: { id: "all" | Category; label: string; icon: typeof Palette }[] = [
  { id: "all", label: "All work", icon: LayoutGrid },
  { id: "design", label: categoryMeta.design.label, icon: Palette },
  { id: "reels", label: categoryMeta.reels.label, icon: Clapperboard },
  { id: "product", label: categoryMeta.product.label, icon: AppWindow },
  { id: "data", label: categoryMeta.data.label, icon: ChartColumn },
];

export function PortfolioBoard({ projects }: { projects: ProjectWithMedia[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) => project.categories.includes(active));
  }, [active, projects]);

  const blurb = active === "all" ? "A Pinterest-style dump of the work, not a case-study graveyard." : categoryMeta[active].blurb;

  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="glass-panel mb-8 rounded-[2rem] px-5 py-5 sm:px-7">
        <p className="text-xs font-semibold tracking-[0.22em] text-sky-deep uppercase">Portfolio</p>
        <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Scroll the board
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{blurb}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const selected = active === filter.id;
            return (
              <Button
                key={filter.id}
                variant={selected ? "gel" : "frost"}
                size="sm"
                onClick={() => setActive(filter.id)}
                aria-pressed={selected}
              >
                <Icon strokeWidth={2} />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
