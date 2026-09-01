import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { cn } from '@/lib/cn';
import { discountPct, isSoldOut } from '@/lib/pricing';
import type { Product } from '@/lib/types';

const GRID_SIZES = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw';

/** Front print at rest; on hover it is wiped off to the right at a slant. */
const FRONT_AT_REST = 'polygon(0% 0%, 118% 0%, 100% 100%, 0% 100%)';
const FRONT_WIPED = 'polygon(118% 0%, 118% 0%, 100% 100%, 100% 100%)';

/**
 * The back print is the reason people buy these tees, so hovering reveals it —
 * as a slanted ink wipe rather than a crossfade, with the piece's own colourway
 * running across the top edge on the same beat.
 *
 * The back image sits underneath, unclipped, and the FRONT is wiped away. Doing
 * it the other way round (clipping the back until hover) looks identical but
 * gives the back image zero area, and Chrome will not fetch a lazy image with
 * no area — so the first hover on every card revealed a blank frame while the
 * download started.
 *
 * Everything is driven by `group-hover` and `group-focus-within`, so a keyboard
 * user gets exactly what a mouse user gets.
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
    <article
      className="group relative"
      style={{ '--accent': product.accent } as React.CSSProperties}
    >
      <Link href={`/drop/${product.slug}`} className="block focus-visible:outline-none">
        <div className="bg-ink-raised relative aspect-[4/5] overflow-hidden">
          {!soldOut && (
            <Image
              src={product.images.back}
              alt=""
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover"
            />
          )}

          <Image
            src={product.images.front}
            alt={`${product.name} in ${product.colourway}, front print`}
            fill
            sizes={sizes}
            priority={priority}
            style={
              soldOut
                ? undefined
                : ({
                    clipPath: FRONT_AT_REST,
                    '--wipe': FRONT_WIPED,
                  } as React.CSSProperties)
            }
            className={cn(
              'object-cover transition-[clip-path,transform] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
              !soldOut &&
                'group-focus-within:[clip-path:var(--wipe)] group-hover:[clip-path:var(--wipe)]',
              soldOut && 'opacity-45 grayscale',
            )}
          />

          {/* The squeegee edge, in the piece's own colourway */}
          {!soldOut && (
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100 group-hover:scale-x-100"
              style={{ backgroundColor: 'var(--accent)' }}
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
