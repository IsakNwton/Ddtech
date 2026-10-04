const BRANDS = ["AMD", "NVIDIA", "Intel", "ASUS", "MSI", "Gigabyte", "Corsair", "Kingston", "Samsung", "Lian Li", "NZXT", "Noctua"];

/** Marcas que se manejan (texto plano: sin reproducir logotipos de terceros) */
export function BrandStrip() {
  return (
    <section aria-label="Marcas" className="container-page">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-line py-6 sm:justify-between">
        {BRANDS.map((b) => (
          <span key={b} className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-subtle transition-colors hover:text-fg-muted">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
