import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { cn } from '@/lib/cn';
import { discountPct, isSoldOut } from '@/lib/pricing';
import type { Product } from '@/lib/types';

const GRID_SIZES = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw';

/**
 * Hovering swaps front print for back print. On these tees the back is the
 * reason people buy, so the hover shows the customer something they want rather
 * than just scaling the card up.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = GRID_SIZES,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const soldOut = isSoldOut(product);
  const isNew = product.tags.includes('new');

  return (
    <article className="group relative">
      <Link href={`/drop/${product.slug}`} className="block focus-visible:outline-none">
        <div className="bg-ink-raised relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.images.front}
            alt={`${product.name} in ${product.colourway}, front print`}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              'object-cover transition-opacity duration-500 ease-out',
              !soldOut && 'group-hover:opacity-0',
              soldOut && 'opacity-45 grayscale',
            )}
          />
          {!soldOut && (
            <Image
              src={product.images.back}
              alt=""
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            />
          )}

          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {product.salePriceAud && <Badge tone="sale">−{discountPct(product)}%</Badge>}
            {isNew && !product.salePriceAud && <Badge tone="new">Just dropped</Badge>}
          </div>

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge tone="soldout" className="px-3 py-2">
                Sold out
              </Badge>
            </div>
          )}

          {/* Outline sits on the wrapper so the focus ring frames the whole card. */}
          <span className="ring-flame pointer-events-none absolute inset-0 group-focus-within:ring-2" />
        </div>

        {/* Name on its own line, then colourway and price on a shared baseline —
            long names wrap without shoving the price around. */}
        <div className="mt-4">
          <h3 className="font-display text-display-m text-balance uppercase">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <p className="label text-ash truncate">{product.colourway}</p>
            <Price
              product={product}
              size="sm"
              showSaving={false}
              className="shrink-0 justify-end"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
