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
  mediaType: DropFile["kind"] | "embed";
  projectSlug: string;
  title: string;
  contentTypes: string;
  contributionChips: string;
  description: string;
  year: string;
  organization: string;
  externalUrl: string;
  publish: string;
  isEmbed: boolean;
  media: DropFile | null;
};

type ManifestRow = {
  source?: string;
  optimized?: string;
  poster?: string;
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

function normalizeSource(value: string) {
  return value.trim().toLowerCase();
}

function buildDropFile(
  filePath: string,
  posterPath: string,
  mediaType: DropFile["kind"],
  details?: ManifestRow,
): DropFile | null {
  const width = details?.optimized_width ?? details?.width;
  const height = details?.optimized_height ?? details?.height;
  if (!width || !height) return null;

  return {
    url: publicUrl(filePath),
    filename: path.basename(filePath),
    ext: path.extname(filePath).toLowerCase(),
    kind: mediaType,
    width,
    height,
    posterUrl: posterPath ? publicUrl(posterPath) : undefined,
    duration: details?.duration_seconds,
  };
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
  const manifestBySource = new Map(
    manifest
      .filter((item) => item.source)
      .map((item) => [normalizeSource(item.source!), item]),
  );

  const rows: IntakeRow[] = [];

  for (const values of records) {
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]));
    const hidden = ["no", "false", "0", "draft"].includes(row.publish.toLowerCase());
    if (hidden) continue;

    const rawMediaType = row.media_type.toLowerCase();
    const isEmbed = rawMediaType === "embed";

    if (isEmbed) {
      if (!row.external_url || !row.title) continue;

      let filePath = row.file_path.replaceAll("\\", "/");
      let posterPath = row.poster_path.replaceAll("\\", "/");
      let details = filePath ? metadata.get(filePath) : undefined;

      if (!filePath && row.source_file) {
        const fromSource = manifestBySource.get(normalizeSource(row.source_file));
        if (fromSource?.optimized) {
          filePath = fromSource.optimized.replaceAll("\\", "/");
          posterPath = fromSource.poster?.replaceAll("\\", "/") ?? "";
          details = fromSource;
        }
      }

      const previewMedia =
        filePath && details
          ? buildDropFile(filePath, posterPath, "image", details)
          : null;

      rows.push({
        sourceFile: row.source_file || row.title,
        filePath,
        posterPath,
        mediaType: "embed",
        projectSlug: row.project_slug,
        title: row.title,
        contentTypes: row.content_types,
        contributionChips: row.contribution_chips,
        description: row.description,
        year: row.year,
        organization: row.organization,
        externalUrl: row.external_url,
        publish: row.publish,
        isEmbed: true,
        media: previewMedia,
      });
      continue;
    }

    let filePath = row.file_path.replaceAll("\\", "/");
    let posterPath = row.poster_path.replaceAll("\\", "/");
    let details = filePath ? metadata.get(filePath) : undefined;

    if (!filePath && row.source_file) {
      const fromSource = manifestBySource.get(normalizeSource(row.source_file));
      if (fromSource?.optimized) {
        filePath = fromSource.optimized.replaceAll("\\", "/");
        posterPath = fromSource.poster?.replaceAll("\\", "/") ?? "";
        details = fromSource;
      }
    }

    const mediaType =
      rawMediaType === "video" ? "video" : rawMediaType === "image" ? "image" : null;
    const media = filePath && mediaType ? buildDropFile(filePath, posterPath, mediaType, details) : null;

    if (!media && !row.title) continue;

    rows.push({
      sourceFile: row.source_file,
      filePath,
      posterPath,
      mediaType: (mediaType ?? "image") as DropFile["kind"],
      projectSlug: row.project_slug,
      title: row.title,
      contentTypes: row.content_types,
      contributionChips: row.contribution_chips,
      description: row.description,
      year: row.year,
      organization: row.organization,
      externalUrl: row.external_url,
      publish: row.publish,
      isEmbed: false,
      media,
    });
  }

  return rows;
}
