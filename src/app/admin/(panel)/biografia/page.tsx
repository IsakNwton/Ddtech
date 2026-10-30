import { ArtistForm } from "@/components/admin/artist-form";
import { requireAdminPage } from "@/lib/auth";
import { getArtistAdmin } from "@/lib/data/admin";

export default async function AdminBiografia() {
  const ctx = await requireAdminPage();
  const artist = await getArtistAdmin(ctx);
  return (
    <div>
      <h1 className="font-display text-5xl">Biografía</h1>
      <p className="mb-10 mt-2 max-w-2xl text-lg text-muted-text">
        Esta información aparece en la página «El artista». Solo se publica lo que escriba aquí: los textos de ejemplo no se guardan.
      </p>
      <ArtistForm artist={artist} readOnly={ctx.mode === "demo"} />
    </div>
  );
}
