'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';
import { formatAud, unitPrice } from '@/lib/pricing';
import type { CartItem, Product } from '@/lib/types';

const stepper =
  'flex h-9 w-9 items-center justify-center border border-ink-line text-bone ' +
  'transition-colors hover:border-bone disabled:cursor-not-allowed disabled:opacity-30';

export function CartLine({
  item,
  product,
  onNavigate,
  compact = false,
}: {
  item: CartItem;
  product: Product;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const price = unitPrice(product);
  const stock = product.stock[item.size];
  const atStockCap = item.qty >= stock;

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/drop/${product.slug}`}
        onClick={onNavigate}
        className="bg-ink-raised relative aspect-[4/5] w-20 shrink-0 overflow-hidden sm:w-24"
      >
        <Image
          src={product.images.front}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/drop/${product.slug}`}
              onClick={onNavigate}
              className={cn(
                'font-display hover:text-flame uppercase',
                compact ? 'text-base' : 'text-display-m',
              )}
            >
              {product.name}
            </Link>
            <p className="label text-ash mt-1.5">
              {product.colourway} · Size {item.size}
            </p>
          </div>
          <p className="font-display shrink-0 text-base">{formatAud(price * item.qty)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={stepper}
              onClick={() => setQty(item.slug, item.size, item.qty - 1)}
              aria-label={`Decrease quantity of ${product.name}, size ${item.size}`}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="font-display w-8 text-center text-base" aria-live="polite">
              {item.qty}
            </span>
            <button
              type="button"
              className={stepper}
              disabled={atStockCap}
              onClick={() => setQty(item.slug, item.size, item.qty + 1)}
              aria-label={`Increase quantity of ${product.name}, size ${item.size}`}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => remove(item.slug, item.size)}
            className="label text-ash hover:text-danger underline underline-offset-4"
          >
            Remove
          </button>
        </div>

        {atStockCap && (
          <p className="label text-danger mt-2">
            {stock === 1 ? 'Last one' : `Only ${stock} left`} in {item.size}
          </p>
        )}
      </div>
    </div>
  );
}
