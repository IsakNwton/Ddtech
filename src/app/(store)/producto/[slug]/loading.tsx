import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page pt-5" aria-busy="true" aria-label="Cargando producto">
      <Skeleton className="h-3 w-64" />
      <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-6 h-[420px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
