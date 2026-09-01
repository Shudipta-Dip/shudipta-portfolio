"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import type { Category } from "../../../content/projects";
import { profile } from "../../../content/profile";
import type { ProjectWithMedia } from "@/lib/portfolio";
import {
  CategoryShortcutButton,
  categoryFilters,
  countForCategoryFilter,
  projectsForScrollingMode,
} from "@/components/portfolio/category-shortcut-button";
import { MasonryGrid } from "@/components/portfolio/masonry-grid";
import { HeroThemeMusic } from "@/components/aero/hero-theme-music";
import { ScrollingModeLauncher } from "@/components/portfolio/scrolling-mode/scrolling-mode-launcher";
import { ScrollingModeOverlay } from "@/components/portfolio/scrolling-mode/scrolling-mode-overlay";

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
  const [active, setActive] = useState<(typeof categoryFilters)[number]["id"]>("all");
  const [scrollingModeOpen, setScrollingModeOpen] = useState(false);
  const [showScrollingLauncher, setShowScrollingLauncher] = useState(false);
  const workGridRef = useRef<HTMLDivElement>(null);

  const scrollingProjects = useMemo(() => projectsForScrollingMode(projects), [projects]);

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((project) => project.categories.includes(active));
  }, [active, projects]);

  const handleBrowseCategory = useCallback((category: Category) => {
    setScrollingModeOpen(false);
    setActive(category);
    window.requestAnimationFrame(() => {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openScrollingMode = useCallback(() => {
    if (scrollingProjects.length) setScrollingModeOpen(true);
  }, [scrollingProjects.length]);

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
        const hasScrolled = window.scrollY > 48;
        setShowScrollingLauncher(hasScrolled && firstRowTop < viewportHeight * 0.72);
        return;
      }

      // Keep the launcher tappable while iOS momentum scrolling settles. A
      // small hysteresis gap avoids disabling pointer events mid-tap.
      setShowScrollingLauncher((isVisible) =>
        isVisible ? firstRowTop < 48 : firstRowTop < -8,
      );
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
          projects={scrollingProjects}
          allProjects={projects}
          onClose={() => setScrollingModeOpen(false)}
          onBrowseCategory={handleBrowseCategory}
        />
      ) : null}
      <ScrollingModeLauncher
        visible={showScrollingLauncher}
        onOpen={openScrollingMode}
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
            <HeroThemeMusic className="self-center md:self-auto" />
          </div>
        </div>
        <div className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {categoryFilters.map((filter) => (
            <CategoryShortcutButton
              key={filter.id}
              filter={filter}
              count={countForCategoryFilter(projects, filter.id)}
              selected={active === filter.id}
              onClick={() => setActive(filter.id)}
            />
          ))}
        </div>
        <MasonryGrid projects={visible} gridRef={workGridRef} />
      </section>
    </>
  );
}
