export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pt-44 sm:px-8 lg:px-14" aria-busy="true" aria-label="Cargando obras">
      <div className="skeleton h-4 w-40 rounded-full" />
      <div className="skeleton mt-8 h-24 w-80 max-w-full rounded-2xl" />
      <div className="skeleton mt-16 h-28 rounded-[1.75rem]" />
      <div className="mt-12 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {[1.4, 0.8, 1.1, 1, 1.3, 0.75].map((r, i) => (
          <div key={i}>
            <div className="skeleton rounded-[2px]" style={{ aspectRatio: `${r}` }} />
            <div className="skeleton mt-5 h-6 w-2/3 rounded-full" />
            <div className="skeleton mt-2 h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
