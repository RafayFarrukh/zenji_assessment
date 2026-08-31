import { Pass } from '@/components/motion/Pass';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';

/**
 * Cards wipe in as the row arrives. The delay is keyed to the column rather
 * than the index, so the tenth card does not sit waiting for a stagger that
 * started nine cards ago — every row reads left to right at the same pace.
 *
 * `Pass` is a client component but `ProductCard` is passed as children, so the
 * cards themselves stay server-rendered.
 */
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
          <Pass delay={(i % 4) * 70}>
            <ProductCard product={product} priority={i < priorityCount} />
          </Pass>
        </li>
      ))}
    </ul>
  );
}
