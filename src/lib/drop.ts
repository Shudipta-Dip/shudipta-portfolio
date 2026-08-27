import { promises as fs } from "node:fs";
import path from "node:path";

const DROP_DIR = path.join(process.cwd(), "content", "drop");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

export type DropFile = {
  url: string;
  filename: string;
  ext: string;
  kind: "image" | "video";
};

export type ProjectMedia = {
  cover?: DropFile;
  gallery: DropFile[];
  videos: DropFile[];
};

function toUrl(relativePath: string) {
  const encoded = relativePath
    .split(/[/\\]/)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/media/${encoded}`;
}

function kindFor(ext: string): DropFile["kind"] | null {
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  return null;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listDropEntries() {
  if (!(await fileExists(DROP_DIR))) return [];
  return fs.readdir(DROP_DIR, { withFileTypes: true });
}

function dropFileFrom(relativePath: string, filename: string): DropFile | null {
  const ext = path.extname(filename).toLowerCase();
  const kind = kindFor(ext);
  if (!kind) return null;
  return {
    url: toUrl(relativePath),
    filename,
    ext,
    kind,
  };
}

function stem(filename: string) {
  return path.parse(filename).name.toLowerCase();
}

function rankCover(file: DropFile, slug: string) {
  const name = stem(file.filename);
  if (name === slug || name === `${slug}-cover` || name === "cover") return 0;
  if (name.startsWith(`${slug}-cover`)) return 1;
  if (name === `${slug}-1` || name === "1") return 2;
  return 10;
}

export async function getProjectMedia(slug: string): Promise<ProjectMedia> {
  const entries = await listDropEntries();
  const collected: DropFile[] = [];

  for (const entry of entries) {
    if (entry.isFile()) {
      const name = stem(entry.name);
      if (name === slug || name.startsWith(`${slug}-`)) {
        const file = dropFileFrom(entry.name, entry.name);
        if (file) collected.push(file);
      }
    }

    if (entry.isDirectory() && entry.name.toLowerCase() === slug) {
      const nestedDir = path.join(DROP_DIR, entry.name);
      const nested = await fs.readdir(nestedDir, { withFileTypes: true });
      for (const child of nested) {
        if (!child.isFile()) continue;
        const relative = `${entry.name}/${child.name}`;
        const file = dropFileFrom(relative, child.name);
        if (file) collected.push(file);
      }
    }
  }

  const images = collected.filter((file) => file.kind === "image");
  const videos = collected.filter((file) => file.kind === "video");
  images.sort((a, b) => rankCover(a, slug) - rankCover(b, slug) || a.filename.localeCompare(b.filename));
  videos.sort((a, b) => a.filename.localeCompare(b.filename));

  const cover = images[0] ?? videos[0];
  const gallery = images.filter((file) => file !== cover);

  return { cover, gallery, videos };
}
