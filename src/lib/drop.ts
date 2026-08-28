import { promises as fs } from "node:fs";
import path from "node:path";

const INTAKE_PATH = path.join(process.cwd(), "content", "portfolio-intake.csv");
const MANIFEST_PATH = path.join(process.cwd(), "content", "media-manifest.json");

export type DropFile = {
  url: string;
  filename: string;
  ext: string;
  kind: "image" | "video";
  width: number;
  height: number;
  posterUrl?: string;
  duration?: number;
};

export type ProjectMedia = {
  cover?: DropFile;
  gallery: DropFile[];
  videos: DropFile[];
};

export type IntakeRow = {
  sourceFile: string;
  filePath: string;
  posterPath: string;
  mediaType: DropFile["kind"];
  projectSlug: string;
  title: string;
  contentTypes: string;
  contributionChips: string;
  description: string;
  year: string;
  organization: string;
  externalUrl: string;
  publish: string;
  media: DropFile;
};

type ManifestRow = {
  optimized?: string;
  width?: number;
  height?: number;
  optimized_width?: number;
  optimized_height?: number;
  duration_seconds?: number;
};

function parseCsv(source: string) {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      record.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && source[index + 1] === "\n") index += 1;
      record.push(field);
      if (record.some(Boolean)) records.push(record);
      record = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || record.length) {
    record.push(field);
    records.push(record);
  }
  return records;
}

function publicUrl(filePath: string) {
  const normalized = filePath.replaceAll("\\", "/").replace(/^public\//, "");
  return `/${normalized
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export async function getIntakeRows(): Promise<IntakeRow[]> {
  const [intakeSource, manifestSource] = await Promise.all([
    fs.readFile(INTAKE_PATH, "utf8"),
    fs.readFile(MANIFEST_PATH, "utf8"),
  ]);
  const [headers, ...records] = parseCsv(intakeSource.replace(/^\uFEFF/, ""));
  const manifest = JSON.parse(manifestSource) as ManifestRow[];
  const metadata = new Map(
    manifest
      .filter((item) => item.optimized)
      .map((item) => [item.optimized!.replaceAll("\\", "/"), item]),
  );

  const rows = records.flatMap((values) => {
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]));
    const filePath = row.file_path;
    const mediaType =
      row.media_type === "video" ? "video" : row.media_type === "image" ? "image" : null;
    const details = metadata.get(filePath.replaceAll("\\", "/"));
    const width = details?.optimized_width ?? details?.width;
    const height = details?.optimized_height ?? details?.height;
    const hidden = ["no", "false", "0", "draft"].includes(row.publish.toLowerCase());

    if (!filePath || !mediaType || !width || !height || hidden) return [];

    return [{
      sourceFile: row.source_file,
      filePath,
      posterPath: row.poster_path,
      mediaType: mediaType as DropFile["kind"],
      projectSlug: row.project_slug,
      title: row.title,
      contentTypes: row.content_types,
      contributionChips: row.contribution_chips,
      description: row.description,
      year: row.year,
      organization: row.organization,
      externalUrl: row.external_url,
      publish: row.publish,
      media: {
        url: publicUrl(filePath),
        filename: path.basename(filePath),
        ext: path.extname(filePath).toLowerCase(),
        kind: mediaType as DropFile["kind"],
        width,
        height,
        posterUrl: row.poster_path ? publicUrl(row.poster_path) : undefined,
        duration: details?.duration_seconds,
      },
    }];
  });

  return rows;
}
