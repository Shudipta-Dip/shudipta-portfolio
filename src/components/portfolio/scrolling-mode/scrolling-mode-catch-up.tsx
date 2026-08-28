import type { Category } from "../../../../content/projects";
import {
  CategoryShortcutButton,
  categoryFilters,
  countForCategoryFilter,
} from "@/components/portfolio/category-shortcut-button";
import type { ProjectWithMedia } from "@/lib/portfolio";

type ScrollingModeCatchUpProps = {
  projects: ProjectWithMedia[];
  onBrowseCategory: (category: Category) => void;
};

const catchUpFilters = categoryFilters.filter((filter) => filter.id === "product" || filter.id === "data");

export function ScrollingModeCatchUp({ projects, onBrowseCategory }: ScrollingModeCatchUpProps) {
  return (
    <section className="reels-slide relative flex h-[100dvh] w-full shrink-0 snap-start snap-always items-center justify-center overflow-hidden">
      <div className="reels-stage-bg absolute inset-0" />
      <div className="relative z-10 w-full max-w-lg px-6 py-10 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-5xl">
          All caught up :)
        </h1>
        <h2 className="font-heading mt-5 text-lg font-semibold tracking-tight text-white/90 sm:text-xl">
          Check out these other project types
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {catchUpFilters.map((filter) => (
            <CategoryShortcutButton
              key={filter.id}
              filter={filter}
              count={countForCategoryFilter(projects, filter.id)}
              onClick={() => onBrowseCategory(filter.id as Category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
