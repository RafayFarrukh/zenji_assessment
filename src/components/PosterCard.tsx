import Image from 'next/image';
import Link from 'next/link';
import { Tilt } from '@/components/motion/Tilt';
import { Badge } from '@/components/ui/Badge';
import { discountPct } from '@/lib/pricing';
import type { Product } from '@/lib/types';

/**
 * The collection strip. Uses the artwork composite rather than the on-model
 * shot, and carries the product's own colourway as a rail down the left edge —
 * one of only two places a per-product accent is allowed to appear.
 *
 * On a desktop pointer the card leans towards the cursor and its colourway
 * glows in from the edges. On touch it is a plain card, which is correct.
 */
export function PosterCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/drop/${product.slug}`}
      className="group relative block h-full"
      style={{ '--accent': product.accent } as React.CSSProperties}
    >
      <Tilt>
        <div className="bg-ink-raised relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images.poster}
            alt={`${product.name} artwork`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 72vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="from-ink absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent" />

          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          {/* The colourway lifts off the edges as the card leans */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ boxShadow: 'inset 0 0 70px -22px var(--accent)' }}
          />

          {product.salePriceAud && (
            <div className="absolute top-3 right-3">
              <Badge tone="sale">−{discountPct(product)}%</Badge>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
            <p
              className="label font-jp mb-2 text-base tracking-normal"
              style={{ color: 'var(--accent)' }}
            >
              {product.kanji.glyphs}
            </p>
            <h3 className="font-display text-display-m uppercase">{product.name}</h3>
            <p className="label text-ash group-hover:text-bone mt-2 flex items-center gap-2 transition-colors">
              Shop {product.colourway}
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
              >
                →
              </span>
            </p>
          </div>
        </div>
      </Tilt>
    </Link>
  );
}
