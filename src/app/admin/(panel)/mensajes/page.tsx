import { Mail, Phone } from "lucide-react";
import { Flash } from "@/components/admin/flash";
import { SubmitButton } from "@/components/admin/ui";
import { setInquiryStatus } from "@/lib/actions/admin";
import { requireAdminPage } from "@/lib/auth";
import { listInquiries } from "@/lib/data/admin";
import { formatDate } from "@/lib/format";

export default async function AdminMensajes({ searchParams }: PageProps<"/admin/mensajes">) {
  const ctx = await requireAdminPage();
  const [inquiries, sp] = await Promise.all([listInquiries(ctx), searchParams]);
  const storing = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return (
    <div>
      <h1 className="font-display text-5xl">Mensajes</h1>
      <p className="mb-8 mt-2 max-w-2xl text-lg text-muted-text">Consultas enviadas desde el formulario de contacto del sitio.</p>
      <Flash code={sp.aviso} />
      {ctx.mode === "live" && !storing && (
        <p className="mb-8 rounded-2xl border-2 border-gold/60 bg-gold/10 px-5 py-4 text-lg">
          Los mensajes no se están guardando aquí porque falta la clave de servicio de Supabase (SUPABASE_SERVICE_ROLE_KEY). Consulte el README.
        </p>
      )}
      {inquiries.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-line-strong bg-paper p-12 text-center">
          <p className="font-display text-3xl">No hay mensajes</p>
          <p className="mt-2 text-lg text-muted-text">{ctx.mode === "demo" ? "En modo demostración no se reciben mensajes." : "Cuando alguien escriba, aparecerá aquí."}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {inquiries.map((q) => (
            <li key={q.id} className={`rounded-3xl border bg-paper p-6 ${q.status === "nueva" ? "border-ink/40" : "border-line opacity-80"}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl">{q.name}</p>
                  <p className="text-base text-muted-text">
                    {formatDate(q.createdAt)} · {q.reason}
                  </p>
                  {q.artworkTitle && <p className="mt-1 text-base">Obra: {q.artworkTitle}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${q.status === "nueva" ? "bg-ink text-paper" : "bg-stone text-muted-text"}`}>
                  {q.status === "nueva" ? "Nueva" : "Atendida"}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">{q.message}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Re: ${q.reason}`)}`} className="press inline-flex min-h-12 items-center gap-2 rounded-xl bg-ink px-5 text-base text-paper">
                  <Mail className="size-4" /> Responder a {q.email}
                </a>
                {q.phone && (
                  <a href={`tel:${q.phone}`} className="press inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-line-strong px-4 text-base">
                    <Phone className="size-4" /> {q.phone}
                  </a>
                )}
                <form action={setInquiryStatus}>
                  <input type="hidden" name="id" value={q.id} />
                  <input type="hidden" name="status" value={q.status === "nueva" ? "atendida" : "nueva"} />
                  <SubmitButton variant="secondary" className="min-h-12 rounded-xl px-4 text-base">
                    {q.status === "nueva" ? "Marcar como atendida" : "Marcar como nueva"}
                  </SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
