import { allArtFiles, renderArtFile } from "@/lib/art/files";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allArtFiles().map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const svg = renderArtFile(file);
  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
