"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { MasonryGrid } from "@/components/portfolio/masonry-grid";
import { HeroFrutigerCd } from "@/components/aero/hero-frutiger-cd";
import { ScrollingModeLauncher } from "@/components/portfolio/scrolling-mode/scrolling-mode-launcher";
import { ScrollingModeOverlay } from "@/components/portfolio/scrolling-mode/scrolling-mode-overlay";
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

function columnCountForGrid(grid: HTMLElement) {
  const fromAttr = Number(grid.getAttribute("data-masonry-columns"));
  if (fromAttr > 0) return fromAttr;

  const columns = grid.querySelectorAll("[data-masonry-column]");
  return columns.length || 1;
}

function firstRowCardsInGrid(grid: HTMLElement) {
  const columnCount = columnCountForGrid(grid);
  const cards = grid.querySelectorAll<HTMLElement>("[data-work-card]");

  return Array.from(cards).filter((card) => {
    const index = Number(card.getAttribute("data-work-index"));
    return !Number.isNaN(index) && index < columnCount;
  });
}

export function PortfolioBoard({ projects }: { projects: ProjectWithMedia[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["id"]>("all");
  const [scrollingModeOpen, setScrollingModeOpen] = useState(false);
  const [showScrollingLauncher, setShowScrollingLauncher] = useState(false);
  const workGridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) => project.categories.includes(active));
  }, [active, projects]);

  useEffect(() => {
    const grid = workGridRef.current;
    if (!grid) return;

    const desktop = window.matchMedia("(min-width: 768px)");

    const updateLauncher = () => {
      if (scrollingModeOpen) {
        setShowScrollingLauncher(false);
        return;
      }

      const firstRow = firstRowCardsInGrid(grid);
      if (!firstRow.length) {
        setShowScrollingLauncher(false);
        return;
      }

      const viewportHeight = window.innerHeight;
      const firstRowTop = Math.min(...firstRow.map((card) => card.getBoundingClientRect().top));
      const firstRowBottom = Math.max(...firstRow.map((card) => card.getBoundingClientRect().bottom));

      if (desktop.matches) {
        // Require actual scroll so the button never appears on initial load.
        // Then trigger once the first row starts moving up.
        const hasScrolled = window.scrollY > 48;
        setShowScrollingLauncher(hasScrolled && firstRowTop < viewportHeight * 0.72);
        return;
      }

      setShowScrollingLauncher(firstRowBottom < 0);
    };

    updateLauncher();
    window.addEventListener("scroll", updateLauncher, { passive: true });
    window.addEventListener("resize", updateLauncher);
    desktop.addEventListener("change", updateLauncher);

    return () => {
      window.removeEventListener("scroll", updateLauncher);
      window.removeEventListener("resize", updateLauncher);
      desktop.removeEventListener("change", updateLauncher);
    };
  }, [scrollingModeOpen, visible.length]);

  return (
    <>
      {scrollingModeOpen ? (
        <ScrollingModeOverlay
          projects={visible}
          onClose={() => setScrollingModeOpen(false)}
        />
      ) : null}
      <ScrollingModeLauncher
        visible={showScrollingLauncher}
        onOpen={() => setScrollingModeOpen(true)}
      />
    <section id="work" className="mx-auto max-w-[90rem] px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
      <div className="glass-shell mb-5 overflow-visible rounded-[2rem]">
        <div className="flex flex-col gap-4 px-5 py-6 sm:px-7 md:flex-row md:items-center md:justify-between md:gap-8 md:pr-8">
          <div className="min-w-0 flex-1">
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
          <HeroFrutigerCd className="self-center md:self-auto" />
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
      <MasonryGrid projects={visible} gridRef={workGridRef} />
    </section>
    </>
  );
}
