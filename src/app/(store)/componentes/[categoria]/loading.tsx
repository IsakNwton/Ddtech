import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page pt-5">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-6 h-9 w-64" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8">
        <CatalogSkeleton />
      </div>
    </div>
  );
}
