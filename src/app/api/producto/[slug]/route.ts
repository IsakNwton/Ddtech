import { getProduct, products } from "@/data/catalog";
import { comparePayload } from "@/lib/compare";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** Datos de comparación de un producto (JSON estático, cacheable) */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json(comparePayload(p), { headers: { "Cache-Control": "public, max-age=3600" } });
}
