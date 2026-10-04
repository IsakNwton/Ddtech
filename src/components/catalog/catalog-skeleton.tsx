import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]" aria-busy="true" aria-label="Cargando productos">
      <div className="hidden space-y-4 lg:block">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
