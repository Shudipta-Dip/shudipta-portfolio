import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { CoverArt, MediaFrame } from "@/components/aero/cover-art";
import { ContributionRow } from "@/components/portfolio/contribution-chip";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { categoryMeta } from "../../../../content/projects";
import { getProjectBySlug, getRelatedProjects, projects } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
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

  const related = getRelatedProjects(project);
  const cover = project.media.cover;
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

      <div className="glass-panel overflow-hidden rounded-[2rem]">
        {cover ? (
          <MediaFrame
            src={cover.url}
            alt={project.title}
            kind={cover.kind}
            className="max-h-[32rem] min-h-[16rem] w-full rounded-none"
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
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((category) => (
              <Badge key={category} variant="outline" className="tracking-[0.14em] uppercase">
                {categoryMeta[category].label}
              </Badge>
            ))}
            <Badge variant="secondary">{project.year}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-sky-deep">{project.org}</p>
            <h1 className="font-heading mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{project.tagline}</p>
          </div>
          <ContributionRow ids={project.contributions} />
          <div className="space-y-4 text-base leading-relaxed text-foreground/85">
            {project.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
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
          <div className="grid gap-4 sm:grid-cols-2">
            {extras.map((file) => (
              <div key={file.url} className="glass-panel overflow-hidden rounded-[1.75rem]">
                <MediaFrame src={file.url} alt="" kind={file.kind} className="min-h-[12rem]" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Drop stills or cuts named <code className="font-medium text-foreground">{project.slug}</code> into{" "}
          <code className="font-medium text-foreground">content/drop/</code> and they will land here.
        </p>
      )}

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
