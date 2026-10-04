import { buildSearchIndex } from "@/data/search-index";

export const dynamic = "force-static";

/** Índice ligero de búsqueda: se descarga una sola vez al enfocar el buscador. */
export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
