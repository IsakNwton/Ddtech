import Link from "next/link";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { requireAdminPage } from "@/lib/auth";
import { listCollectionsAdmin } from "@/lib/data/admin";

export default async function NuevaObra() {
  const ctx = await requireAdminPage();
  const collections = await listCollectionsAdmin(ctx);
  return (
    <div>
      <Link href="/admin/obras" className="text-lg underline underline-offset-4">
        ← Volver a mis pinturas
      </Link>
      <h1 className="mt-4 font-display text-5xl">Agregar una pintura</h1>
      <p className="mb-10 mt-2 max-w-2xl text-lg text-muted-text">
        Complete los pasos con calma. Puede guardarla como borrador y terminarla otro día: los borradores no se ven en la galería.
      </p>
      <ArtworkForm collections={collections.map((c) => ({ id: c.id, title: c.title }))} readOnly={ctx.mode === "demo"} />
    </div>
  );
}
