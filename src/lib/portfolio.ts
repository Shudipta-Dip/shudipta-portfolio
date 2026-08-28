import {
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
  displayContentType: string;
  displayContributions: string[];
  isEmbed: boolean;
  embedUrl?: string;
};

const PINNED_BOARD_LEAD = [
  { slug: "trend-recreation", title: "Trend Recreation" },
  { slug: "ncc-bank-hero-ovc", title: "NCC Bank Hero OVC" },
  { slug: "year-recap", title: "Year Recap" },
  { slug: "platform-launch", title: "Platform Launch" },
  { slug: "testimonial-cta", title: "Testimonial CTA" },
] as const;

function matchesPinnedLead(
  project: ProjectWithMedia,
  pinned: (typeof PINNED_BOARD_LEAD)[number],
) {
  return project.slug === pinned.slug || project.title === pinned.title;
}

function sortWithPinnedLead(projects: ProjectWithMedia[]) {
  const used = new Set<string>();
  const pinned: ProjectWithMedia[] = [];

  for (const entry of PINNED_BOARD_LEAD) {
    const match = projects.find((project) => !used.has(project.slug) && matchesPinnedLead(project, entry));
    if (match) {
      pinned.push(match);
      used.add(match.slug);
    }
  }

  const rest = projects.filter((project) => !used.has(project.slug));
  return reorderBoardProjects([...pinned, ...scatterProductDataProjects(rest)]);
}

function hashSlug(slug: string) {
  let hash = 2166136261;
  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shouldScatterOnBoard(project: ProjectWithMedia) {
  const hasProductOrData =
    project.categories.includes("product") || project.categories.includes("data");
  if (!hasProductOrData) return false;

  const hasDesignOrReels =
    project.categories.includes("design") || project.categories.includes("reels");
  if (hasDesignOrReels && !project.isEmbed) return false;

  return true;
}

function scatterProductDataProjects(projects: ProjectWithMedia[]) {
  const scatter: ProjectWithMedia[] = [];
  const anchors: ProjectWithMedia[] = [];

  for (const project of projects) {
    if (shouldScatterOnBoard(project)) scatter.push(project);
    else anchors.push(project);
  }

  if (!scatter.length || !anchors.length) return projects;

  const orderedScatter = [...scatter].sort((a, b) => hashSlug(a.slug) - hashSlug(b.slug));
  const result = [...anchors];
  const baseStep = result.length / (orderedScatter.length + 1);

  orderedScatter.forEach((project, index) => {
    const jitter = (hashSlug(project.slug) % 100) / 100;
    const slot = Math.round((index + 1) * baseStep + jitter * Math.max(1, baseStep * 0.35));
    const insertAt = Math.min(Math.max(0, slot), result.length);
    result.splice(insertAt, 0, project);
  });

  return result;
}

function placeAdjacent(
  projects: ProjectWithMedia[],
  firstSlug: string,
  secondSlug: string,
) {
  const result = [...projects];
  const firstIndex = result.findIndex((project) => project.slug === firstSlug);
  const secondIndex = result.findIndex((project) => project.slug === secondSlug);
  if (firstIndex === -1 || secondIndex === -1 || secondIndex === firstIndex + 1) return result;

  const [second] = result.splice(secondIndex, 1);
  const insertAt = secondIndex < firstIndex ? firstIndex : firstIndex + 1;
  result.splice(insertAt, 0, second);
  return result;
}

function avoidStackedFollower(
  projects: ProjectWithMedia[],
  anchorSlug: string,
  followerSlug: string,
  columns = 4,
) {
  const result = [...projects];
  const anchorIndex = result.findIndex((project) => project.slug === anchorSlug);
  let followerIndex = result.findIndex((project) => project.slug === followerSlug);
  if (anchorIndex === -1 || followerIndex === -1 || followerIndex <= anchorIndex) return result;

  while ((followerIndex - anchorIndex) % columns === 0) {
    const swapIndex = followerIndex - 1;
    if (swapIndex <= anchorIndex) break;
    [result[followerIndex], result[swapIndex]] = [result[swapIndex]!, result[followerIndex]!];
    followerIndex = swapIndex;
  }

  return result;
}

function reorderBoardProjects(projects: ProjectWithMedia[]) {
  let ordered = projects;
  ordered = placeAdjacent(ordered, "product-bts-coverage", "product-bts-coverage-2");
  ordered = placeAdjacent(ordered, "infographic-1", "infographic-2");
  ordered = avoidStackedFollower(ordered, "short-form-repurpose", "commward-winning-campaign");
  return ordered;
}

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

const categoryAliases: Record<string, Category> = {
  design: "design",
  reels: "reels",
  reel: "reels",
  story: "reels",
  product: "product",
  data: "data",
  static: "design",
  banner: "design",
  print: "design",
  website: "product",
  webapp: "product",
  embed: "product",
};

const contributionAliases: Record<string, ContributionId> = {
  ux: "ux",
  visual: "visual",
  copy: "copy",
  strategy: "strategy",
  video: "video",
  edit: "edit",
  ads: "ads",
  print: "print",
  product: "product",
  code: "code",
  ml: "ml",
  dashboard: "dashboard",
  research: "research",
  seo: "seo",
  gtm: "gtm",
};

function splitPipe(value: string) {
  return value
    .split("|")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function splitPipeVerbatim(value: string) {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase()
      .slice(0, 64) || "portfolio-media"
  );
}

function displayTitle(filename: string) {
  return filename
    .replace(/\.(avif|gif|jpe?g|m4v|mov|mp4|png|webm|webp)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueSlug(base: string, used: Set<string>) {
  let candidate = base;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

function categoriesFor(row: IntakeRow): Category[] {
  const tokens = splitPipe(row.contentTypes);
  if (!tokens.length) {
    if (row.isEmbed) return ["product"];
    return [row.media?.kind === "video" ? "reels" : "design"];
  }

  const selected = new Set<Category>();
  for (const token of tokens) {
    if (token === "data") {
      selected.add("data");
      continue;
    }

    const aliased = categoryAliases[token];
    if (aliased === "design" || aliased === "reels") {
      selected.add(aliased);
      continue;
    }

    selected.add("product");
  }

  return selected.size ? [...selected] : ["product"];
}

function intakeLabels(row: IntakeRow) {
  return {
    displayContentType: row.contentTypes.trim().toUpperCase(),
    displayContributions: splitPipeVerbatim(row.contributionChips),
  };
}

function contributionsFor(row: IntakeRow): ContributionId[] {
  const selected = splitPipe(row.contributionChips)
    .map((item) => contributionAliases[item] ?? (contributionIds.has(item as ContributionId) ? item : null))
    .filter((item): item is ContributionId => Boolean(item) && contributionIds.has(item));
  return selected.length
    ? [...new Set(selected)]
    : [row.media?.kind === "video" ? "video" : row.isEmbed ? "product" : "visual"];
}

function shapeFor(width: number, height: number): CoverShape {
  const ratio = width / height;
  if (ratio >= 1.3) return "landscape";
  if (ratio >= 0.9) return "square";
  if (ratio >= 0.7) return "portrait";
  return "tall";
}

function mediaFor(rows: IntakeRow[]): ProjectMedia {
  const files = rows.flatMap((row) => (row.media ? [row.media] : []));
  const cover = files[0];
  return {
    cover,
    gallery: files.filter((file) => file.kind === "image" && file.url !== cover?.url),
    videos: files.filter((file) => file.kind === "video"),
  };
}

function embedFields(row: IntakeRow) {
  return {
    isEmbed: row.isEmbed,
    embedUrl: row.isEmbed ? row.externalUrl : undefined,
  };
}

function makePreviewProject(
  rows: IntakeRow[],
  index: number,
  usedSlugs: Set<string>,
): ProjectWithMedia {
  const lead = rows[0];
  const title = lead.title || displayTitle(lead.sourceFile);
  const description =
    lead.description ||
    (lead.isEmbed
      ? "Interactive project embedded from the live build."
      : `${lead.media?.kind === "video" ? "Video" : "Design"} work from the portfolio media drop.`);
  const links = lead.externalUrl
    ? [{ label: lead.isEmbed ? "Open live build" : "Visit project", href: lead.externalUrl }]
    : undefined;
  const baseSlug = lead.title
    ? slugify(lead.title)
    : lead.projectSlug || `drop-${slugify(displayTitle(lead.sourceFile))}`;

  const labels = intakeLabels(lead);

  return {
    slug: uniqueSlug(baseSlug, usedSlugs),
    title,
    tagline: description,
    summary: description,
    body: [],
    year: lead.year || "Selected work",
    org: lead.organization || "Portfolio media",
    categories: categoriesFor(lead),
    contributions: contributionsFor(lead),
    links,
    coverShape: lead.media
      ? shapeFor(lead.media.width, lead.media.height)
      : lead.isEmbed
        ? "landscape"
        : "square",
    accent: accents[index % accents.length],
    media: mediaFor(rows),
    ...labels,
    ...embedFields(lead),
  };
}

function applyIntake(project: Project, rows: IntakeRow[]): ProjectWithMedia {
  const lead = rows[0];
  if (!lead) {
    return {
      ...project,
      media: mediaFor([]),
      displayContentType: "",
      displayContributions: [],
      isEmbed: false,
    };
  }

  const description = lead.description || project.tagline;
  const intakeCategories = lead.contentTypes ? categoriesFor(lead) : project.categories;
  const intakeContributions = lead.contributionChips
    ? contributionsFor(lead)
    : project.contributions;

  const labels = intakeLabels(lead);

  return {
    ...project,
    title: lead.title || project.title,
    tagline: description,
    summary: lead.description || project.summary,
    body: [],
    year: lead.year || project.year,
    org: lead.organization || project.org,
    categories: intakeCategories,
    contributions: intakeContributions,
    links: lead.externalUrl
      ? [{ label: lead.isEmbed ? "Open live build" : "Visit project", href: lead.externalUrl }]
      : project.links,
    coverShape: lead.media
      ? shapeFor(lead.media.width, lead.media.height)
      : project.coverShape,
    media: mediaFor(rows),
    ...labels,
    ...embedFields(lead),
  };
}

export async function getProjectsWithMedia(): Promise<ProjectWithMedia[]> {
  const intake = await getIntakeRows();
  const knownSlugs = new Set(projects.map((project) => project.slug));
  const assigned = new Map<string, IntakeRow[]>();
  const previews: IntakeRow[][] = [];

  for (const row of intake) {
    // Only fold into the hand-authored project catalog when the slug matches.
    // Shared campaign labels like saas-promo stay as individual titled cards.
    if (row.projectSlug && knownSlugs.has(row.projectSlug)) {
      assigned.set(row.projectSlug, [...(assigned.get(row.projectSlug) ?? []), row]);
    } else {
      previews.push([row]);
    }
  }

  const established = projects
    .filter((project) => assigned.has(project.slug))
    .map((project) => applyIntake(project, assigned.get(project.slug) ?? []));
  const usedSlugs = new Set(established.map((project) => project.slug));
  const previewProjects = previews.map((rows, index) =>
    makePreviewProject(rows, index, usedSlugs),
  );

  return sortWithPinnedLead([...previewProjects, ...established]);
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
