import Link from "next/link";
import { AvailabilityBadge } from "@/components/ui/badges";
import { formatDimensions, formatPrice } from "@/lib/format";
import type { Artwork, Collection } from "@/lib/types";

/** Ficha técnica con la sobriedad de una cartela de museo */
export function SpecSheet({ work, collection }: { work: Artwork; collection: Collection | null }) {
  const price = formatPrice(work.price, work.availability);
  const rows: [string, React.ReactNode][] = [
    ["Autor", work.author],
    ["Año", work.year],
    ["Técnica", work.technique],
    ["Materiales", work.materials],
    ["Soporte", work.support],
    ["Dimensiones", <span key="d">{formatDimensions(work.dimensions)} <span className="text-muted-text">(alto × ancho{work.dimensions.depth ? " × fondo" : ""})</span></span>],
    [
      "Colección",
      collection ? (
        <Link key="c" href={`/colecciones/${collection.slug}`} className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink">
          {collection.title}
        </Link>
      ) : (
        "—"
      ),
    ],
    ["Estilo", work.style],
    ["Inventario", <span key="i" className="font-mono text-[0.8125rem] tracking-wide">{work.inventoryNumber}</span>],
    ["Certificado", work.certificate.included ? (work.certificate.note ?? "Incluye certificado de autenticidad") : (work.certificate.note ?? "No incluido")],
    ["Disponibilidad", <AvailabilityBadge key="a" value={work.availability} size="md" className="text-ink" />],
  ];
  if (price) rows.push(["Precio", price]);

  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3.5 text-[0.9375rem] sm:grid-cols-[10rem_1fr]">
          <dt className="eyebrow pt-[0.2rem]">{k}</dt>
          <dd className="text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
