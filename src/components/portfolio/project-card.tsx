import { Expand, Globe, Play } from "lucide-react";
import Link from "next/link";

import { CoverArt, MediaFrame } from "@/components/aero/cover-art";
import { BoardEmbedPreview } from "@/components/portfolio/board-embed-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectWithMedia } from "@/lib/portfolio";
import { IntakeChipRow } from "@/components/portfolio/contribution-chip";

export function ProjectCard({ project }: { project: ProjectWithMedia }) {
  const cover = project.media.cover;
  const hasVideo = cover?.kind === "video" || project.media.videos.length > 0;

  return (
    <Link href={`/work/${project.slug}`} className="group inline-block w-full">
      <Card className="gap-0 py-0 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(14,90,130,0.22)]">
        <div className="group/cover relative">
          {project.isEmbed && project.embedUrl && !cover ? (
            <BoardEmbedPreview
              url={project.embedUrl}
              title={project.title}
              accent={project.accent}
              category={project.categories[0]}
            />
          ) : cover ? (
            <MediaFrame
              src={cover.url}
              alt={project.title}
              kind={cover.kind}
              width={cover.width}
              height={cover.height}
              posterUrl={cover.posterUrl}
              duration={cover.duration}
              preview
            />
          ) : (
            <CoverArt
              accent={project.accent}
              category={project.categories[0]}
              shape={project.coverShape}
            />
          )}
          <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5">
            {project.isEmbed ? (
              <span className="gel-surface inline-flex size-8 items-center justify-center rounded-full border border-white/70 text-white">
                <Globe className="size-3.5" />
              </span>
            ) : null}
            {hasVideo ? (
              <span className="gel-surface inline-flex size-8 items-center justify-center rounded-full border border-white/70 text-white transition-opacity group-hover/cover:opacity-0">
                <Play className="size-3.5 fill-white" />
              </span>
            ) : null}
            <span className="chip-gel inline-flex size-8 items-center justify-center rounded-full text-foreground opacity-90 transition-opacity group-hover:opacity-100">
              <Expand className="size-3.5" strokeWidth={2} />
              <span className="sr-only">Open full view</span>
            </span>
          </div>
        </div>
        <CardHeader className="gap-2 px-4 pt-4 pb-2">
          <CardTitle className="font-heading text-lg font-semibold tracking-tight">
            {project.title}
          </CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
        </CardHeader>
        <CardContent className="px-4 pt-1 pb-4">
          <IntakeChipRow labels={project.displayContributions} />
        </CardContent>
      </Card>
    </Link>
  );
}
