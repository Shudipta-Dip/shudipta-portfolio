import type { LucideIcon } from "lucide-react";
import { AppWindow, ChartColumn, Clapperboard, LayoutGrid, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categoryMeta, type Category } from "../../../content/projects";
import type { ProjectWithMedia } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export type CategoryFilterId = "all" | Category;

export const categoryFilters: {
  id: CategoryFilterId;
  label: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  { id: "all", label: "All work", icon: LayoutGrid, tone: "aero-shortcut-blue" },
  { id: "design", label: categoryMeta.design.label, icon: Palette, tone: "aero-shortcut-lime" },
  { id: "reels", label: categoryMeta.reels.label, icon: Clapperboard, tone: "aero-shortcut-aqua" },
  { id: "product", label: categoryMeta.product.label, icon: AppWindow, tone: "aero-shortcut-sun" },
  { id: "data", label: categoryMeta.data.label, icon: ChartColumn, tone: "aero-shortcut-deep" },
];

export function countForCategoryFilter(projects: ProjectWithMedia[], id: CategoryFilterId) {
  if (id === "all") return projects.length;
  return projects.filter((project) => project.categories.includes(id)).length;
}

export function projectsForScrollingMode(projects: ProjectWithMedia[]) {
  return projects.filter(
    (project) =>
      project.media.cover &&
      !project.categories.includes("product") &&
      !project.categories.includes("data"),
  );
}

type CategoryShortcutButtonProps = {
  filter: (typeof categoryFilters)[number];
  count: number;
  selected?: boolean;
  onClick: () => void;
  className?: string;
};

export function CategoryShortcutButton({
  filter,
  count,
  selected = false,
  onClick,
  className,
}: CategoryShortcutButtonProps) {
  const Icon = filter.icon;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "aero-shortcut h-auto min-h-21 justify-start gap-3 rounded-[1.35rem] px-3 py-3 text-left",
        filter.tone,
        selected && "aero-shortcut-active",
        className,
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
}
