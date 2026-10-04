import type { ProductSummary } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: ProductSummary[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((p, i) => (
        <li key={p.id} className="flex">
          <ProductCard product={p} priority={i < priorityCount} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
