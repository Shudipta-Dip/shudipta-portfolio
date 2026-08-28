import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { CoverArt, MediaFrame } from "@/components/aero/cover-art";
import { IntakeChipRow, MetaChipRow } from "@/components/portfolio/contribution-chip";
import { ProjectEmbed } from "@/components/portfolio/project-embed";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug, getProjectsWithMedia, getRelatedProjects } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjectsWithMedia();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjectsWithMedia();
  const related = getRelatedProjects(allProjects, project);
  const cover = project.media.cover;
  const portraitCover = cover ? cover.width / cover.height < 0.9 : false;
  const extras = [
    ...project.media.gallery,
    ...project.media.videos.filter((file) => file.url !== cover?.url),
  ];

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/#work" className={cn(buttonVariants({ variant: "frost", size: "sm" }), "mb-6")}>
        <ArrowLeft />
        Back to the board
      </Link>

      <div
        className={cn(
          "glass-panel overflow-hidden rounded-[2rem]",
          portraitCover && "lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(22rem,1fr)] lg:items-start",
        )}
      >
        {project.isEmbed && project.embedUrl ? (
          <ProjectEmbed
            url={project.embedUrl}
            title={project.title}
            className="min-h-[70vh] rounded-none lg:min-h-[calc(100vh-12rem)]"
          />
        ) : cover ? (
          <MediaFrame
            src={cover.url}
            alt={project.title}
            kind={cover.kind}
            width={cover.width}
            height={cover.height}
            posterUrl={cover.posterUrl}
            controls={cover.kind === "video"}
            className="w-full rounded-none"
          />
        ) : (
          <CoverArt
            accent={project.accent}
            category={project.categories[0]}
            shape="landscape"
            className="min-h-[18rem] rounded-none"
          />
        )}

        <div className="space-y-6 px-5 py-8 sm:px-10">
          <MetaChipRow
            contentType={project.displayContentType}
            organization={project.org}
            year={project.year}
          />
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            {project.tagline ? (
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{project.tagline}</p>
            ) : null}
          </div>
          <IntakeChipRow labels={project.displayContributions} />
          {project.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "gel", size: "sm" }))}
                >
                  {link.label}
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {extras.length ? (
        <section className="mt-8">
          <h2 className="font-heading mb-4 text-2xl font-semibold">More from the drop</h2>
          <div className="columns-1 gap-4 md:columns-2">
            {extras.map((file) => (
              <div
                key={file.url}
                className="glass-panel mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[1.75rem]"
              >
                <MediaFrame
                  src={file.url}
                  alt={`${project.title} portfolio media`}
                  kind={file.kind}
                  width={file.width}
                  height={file.height}
                  posterUrl={file.posterUrl}
                  controls={file.kind === "video"}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mt-12">
          <h2 className="font-heading mb-4 text-2xl font-semibold">Adjacent work</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="glass-panel rounded-[1.5rem] px-5 py-5 transition-transform hover:-translate-y-0.5"
              >
                <p className="text-xs tracking-[0.16em] text-sky-deep uppercase">{item.year}</p>
                <p className="font-heading mt-1 text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
