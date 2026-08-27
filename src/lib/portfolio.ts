import { projects, type Category, type Project } from "../../content/projects";
import { getProfileMedia, getProjectMedia, type DropFile, type ProjectMedia } from "./drop";

export type ProjectWithMedia = Project & {
  media: ProjectMedia;
};

export async function getProjectsWithMedia(): Promise<ProjectWithMedia[]> {
  return Promise.all(
    projects.map(async (project) => ({
      ...project,
      media: await getProjectMedia(project.slug),
    })),
  );
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMedia | undefined> {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return undefined;
  return {
    ...project,
    media: await getProjectMedia(project.slug),
  };
}

export function getRelatedProjects(project: Project, limit = 3) {
  return projects
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

export async function getSiteMedia(): Promise<{ portrait?: DropFile }> {
  return { portrait: await getProfileMedia() };
}

export { projects };
