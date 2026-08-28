"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ProjectWithMedia } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

import { ProjectCard } from "./project-card";

function columnCountForWidth(width: number) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
}

const CARD_META_HEIGHT = 132;

const ADJACENT_BOARD_PAIRS = [
  ["product-bts-coverage", "product-bts-coverage-2"],
  ["infographic-1", "infographic-2"],
] as const;

function pairMateSlug(slug: string) {
  for (const [left, right] of ADJACENT_BOARD_PAIRS) {
    if (slug === left) return right;
    if (slug === right) return left;
  }
  return null;
}

function estimateCardHeight(project: ProjectWithMedia, columnWidth: number) {
  const cover = project.media.cover;
  if (!cover?.width || !cover.height) return 280;
  return (cover.height / cover.width) * columnWidth + CARD_META_HEIGHT;
}

function shortestColumn(heights: number[]) {
  let target = 0;
  for (let index = 1; index < heights.length; index += 1) {
    if (heights[index]! < heights[target]!) target = index;
  }
  return target;
}

function bestAdjacentColumnPair(heights: number[], columnCount: number) {
  if (columnCount < 2) return 0;

  let bestIndex = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 0; index < columnCount - 1; index += 1) {
    const score = Math.max(heights[index]!, heights[index + 1]!);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function splitIntoShortestColumns(
  projects: ProjectWithMedia[],
  columnCount: number,
  columnWidth: number,
) {
  const columns = Array.from({ length: columnCount }, () => [] as ProjectWithMedia[]);
  const heights = Array.from({ length: columnCount }, () => 0);
  const placed = new Set<string>();

  for (const project of projects) {
    if (placed.has(project.slug)) continue;

    const mateSlug = pairMateSlug(project.slug);
    const mate = mateSlug ? projects.find((item) => item.slug === mateSlug) : undefined;

    if (mate && !placed.has(mate.slug) && columnCount > 1) {
      const leftColumn = bestAdjacentColumnPair(heights, columnCount);
      const rightColumn = leftColumn + 1;
      const leftHeight = estimateCardHeight(project, columnWidth);
      const rightHeight = estimateCardHeight(mate, columnWidth);
      const rowTop = Math.max(heights[leftColumn]!, heights[rightColumn]!);

      columns[leftColumn]!.push(project);
      columns[rightColumn]!.push(mate);
      heights[leftColumn] = rowTop + leftHeight + 16;
      heights[rightColumn] = rowTop + rightHeight + 16;
      placed.add(project.slug);
      placed.add(mate.slug);
      continue;
    }

    const targetColumn = shortestColumn(heights);
    columns[targetColumn]!.push(project);
    heights[targetColumn]! += estimateCardHeight(project, columnWidth) + 16;
    placed.add(project.slug);
  }

  return columns;
}

type MasonryGridProps = {
  projects: ProjectWithMedia[];
  className?: string;
  gridRef?: React.Ref<HTMLDivElement>;
};

export function MasonryGrid({ projects, className, gridRef }: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ columnCount: 1, columnWidth: 320 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const columnCount = columnCountForWidth(node.clientWidth);
      const columnWidth = node.clientWidth / columnCount - ((columnCount - 1) * 16) / columnCount;
      setLayout({ columnCount, columnWidth });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const columns = useMemo(
    () => splitIntoShortestColumns(projects, layout.columnCount, layout.columnWidth),
    [projects, layout.columnCount, layout.columnWidth],
  );

  const setGridRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof gridRef === "function") gridRef(node);
    else if (gridRef) gridRef.current = node;
  };

  return (
    <div
      ref={setGridRef}
      className={cn("flex items-start gap-4", className)}
      data-masonry-columns={layout.columnCount}
    >
      {columns.map((column, columnIndex) => (
        <div
          key={`masonry-column-${columnIndex}`}
          data-masonry-column
          className="flex min-w-0 flex-1 flex-col gap-4"
        >
          {column.map((project) => {
            const sourceIndex = projects.indexOf(project);
            return (
              <div
                key={project.slug}
                data-work-card
                data-work-index={sourceIndex}
                className="break-inside-avoid"
              >
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { columnCountForWidth };
