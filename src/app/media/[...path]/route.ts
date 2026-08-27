import { promises as fs } from "node:fs";

import { contentTypeFor, resolveDropFile } from "@/lib/drop";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: parts } = await context.params;
  const filePath = await resolveDropFile(parts);
  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  const data = await fs.readFile(filePath);
  return new Response(data, {
    headers: {
      "Content-Type": contentTypeFor(filePath),
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
