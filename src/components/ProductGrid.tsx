import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  /** Number of leading cards to preload — only ever the ones above the fold. */
  priorityCount?: number;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {products.map((product, i) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
