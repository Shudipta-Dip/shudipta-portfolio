import {
  categories,
  projects,
  type Accent,
  type Category,
  type ContributionId,
  type CoverShape,
  type Project,
} from "../../content/projects";
import { getIntakeRows, type IntakeRow, type ProjectMedia } from "./drop";

export type ProjectWithMedia = Project & {
  media: ProjectMedia;
};

const contributionIds = new Set<ContributionId>([
  "ux",
  "visual",
  "copy",
  "strategy",
  "video",
  "edit",
  "ads",
  "print",
  "product",
  "code",
  "ml",
  "dashboard",
  "research",
  "seo",
  "gtm",
]);

const accents: Accent[] = ["cyan", "lime", "aqua", "meadow"];

function splitPipe(value: string) {
  return value
    .split("|")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 64) || "portfolio-media";
}

function displayTitle(filename: string) {
  return filename
    .replace(/\.(avif|gif|jpe?g|m4v|mov|mp4|png|webm|webp)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categoriesFor(row: IntakeRow): Category[] {
  const selected = splitPipe(row.contentTypes).filter((item): item is Category =>
    categories.includes(item as Category),
  );
  return selected.length ? selected : [row.mediaType === "video" ? "reels" : "design"];
}

function contributionsFor(row: IntakeRow): ContributionId[] {
  const selected = splitPipe(row.contributionChips).filter((item): item is ContributionId =>
    contributionIds.has(item as ContributionId),
  );
  return selected.length ? selected : [row.mediaType === "video" ? "video" : "visual"];
}

function shapeFor(width: number, height: number): CoverShape {
  const ratio = width / height;
  if (ratio >= 1.3) return "landscape";
  if (ratio >= 0.9) return "square";
  if (ratio >= 0.7) return "portrait";
  return "tall";
}

function mediaFor(rows: IntakeRow[]): ProjectMedia {
  const files = rows.map((row) => row.media);
  const cover = files[0];
  return {
    cover,
    gallery: files.filter((file) => file.kind === "image" && file.url !== cover?.url),
    videos: files.filter((file) => file.kind === "video"),
  };
}

function makePreviewProject(rows: IntakeRow[], index: number): ProjectWithMedia {
  const lead = rows[0];
  const title = lead.title || displayTitle(lead.sourceFile);
  const description =
    lead.description ||
    `${lead.mediaType === "video" ? "Video" : "Design"} work from the portfolio media drop.`;
  const links = lead.externalUrl ? [{ label: "Visit project", href: lead.externalUrl }] : undefined;

  return {
    slug: lead.projectSlug || `drop-${slugify(displayTitle(lead.sourceFile))}`,
    title,
    tagline: description,
    summary: description,
    body: [description],
    year: lead.year || "Selected work",
    org: lead.organization || "Portfolio media",
    categories: categoriesFor(lead),
    contributions: contributionsFor(lead),
    links,
    coverShape: shapeFor(lead.media.width, lead.media.height),
    accent: accents[index % accents.length],
    media: mediaFor(rows),
  };
}

function applyIntake(project: Project, rows: IntakeRow[]): ProjectWithMedia {
  const lead = rows[0];
  if (!lead) return { ...project, media: mediaFor([]) };

  const description = lead.description || project.tagline;
  const intakeCategories = lead.contentTypes ? categoriesFor(lead) : project.categories;
  const intakeContributions = lead.contributionChips
    ? contributionsFor(lead)
    : project.contributions;

  return {
    ...project,
    title: lead.title || project.title,
    tagline: description,
    summary: lead.description || project.summary,
    body: lead.description ? [lead.description] : project.body,
    year: lead.year || project.year,
    org: lead.organization || project.org,
    categories: intakeCategories,
    contributions: intakeContributions,
    links: lead.externalUrl
      ? [{ label: "Visit project", href: lead.externalUrl }]
      : project.links,
    coverShape: shapeFor(lead.media.width, lead.media.height),
    media: mediaFor(rows),
  };
}

export async function getProjectsWithMedia(): Promise<ProjectWithMedia[]> {
  const intake = await getIntakeRows();
  const assigned = new Map<string, IntakeRow[]>();
  const previews: IntakeRow[][] = [];

  for (const row of intake) {
    if (row.projectSlug) {
      assigned.set(row.projectSlug, [...(assigned.get(row.projectSlug) ?? []), row]);
    } else {
      previews.push([row]);
    }
  }

  const established = projects
    .filter((project) => assigned.has(project.slug))
    .map((project) => applyIntake(project, assigned.get(project.slug) ?? []));
  const knownSlugs = new Set(projects.map((project) => project.slug));
  const customGroups = [...assigned.entries()]
    .filter(([slug]) => !knownSlugs.has(slug))
    .map(([, rows]) => rows);
  const previewProjects = [...previews, ...customGroups].map(makePreviewProject);

  return [...previewProjects, ...established];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMedia | undefined> {
  return (await getProjectsWithMedia()).find((item) => item.slug === slug);
}

export function getRelatedProjects(allProjects: Project[], project: Project, limit = 3) {
  return allProjects
    .filter((item) => item.slug !== project.slug)
    .map((item) => ({
      item,
      overlap: item.categories.filter((category) => project.categories.includes(category)).length,
    }))
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function filterProjects(items: ProjectWithMedia[], category: Category | "all") {
  if (category === "all") return items;
  return items.filter((item) => item.categories.includes(category));
}

export { projects };
