'use client';

import { useEffect, useRef, useState } from 'react';
import { Price } from '@/components/ui/Price';
import { btn } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/icons';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';
import { FREE_SHIPPING_THRESHOLD_AUD } from '@/data/products';
import { LOW_STOCK_AT, formatAudCompact, isSoldOut } from '@/lib/pricing';
import { SIZES, type Product, type Size } from '@/lib/types';

export function BuyBox({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<Size | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [inlineVisible, setInlineVisible] = useState(true);

  const inlineRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const soldOut = isSoldOut(product);
  const selectedStock = size ? product.stock[size] : 0;

  // The sticky bar only appears once the real button has scrolled away.
  useEffect(() => {
    const el = inlineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInlineVisible(entry?.isIntersecting ?? true),
      { rootMargin: '-72px 0px 0px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const id = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(id);
  }, [added]);

  function handleAdd() {
    if (soldOut) return;
    if (!size) {
      setShowSizeError(true);
      pickerRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pickerRef.current
        ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
        ?.focus();
      return;
    }
    add(product.slug, size);
    setAdded(true);
  }

  return (
    <>
      <div ref={pickerRef} className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="label text-ash">Size</h2>
          <a
            href="#sizing"
            className="label text-ash hover:text-bone underline underline-offset-4"
          >
            Size guide
          </a>
        </div>

        <div
          role="radiogroup"
          aria-label="Select a size"
          aria-describedby="size-help"
          className="mt-3 grid grid-cols-6 gap-2"
        >
          {SIZES.map((s) => {
            const stock = product.stock[s];
            const out = stock === 0;
            const selected = size === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={out}
                onClick={() => {
                  setSize(s);
                  setShowSizeError(false);
                }}
                className={cn(
                  'font-display relative flex h-12 items-center justify-center border text-sm tracking-[0.06em] transition-colors',
                  out && 'border-ink-line text-ash/50 cursor-not-allowed',
                  !out && selected && 'border-bone bg-bone text-ink',
                  !out && !selected && 'border-ink-line text-bone hover:border-bone',
                )}
              >
                {s}
                {out && (
                  <span
                    aria-hidden
                    className="bg-ash/50 absolute inset-x-1 top-1/2 h-px -rotate-[24deg]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <p id="size-help" className="mt-3 min-h-[1.25rem] text-sm">
          {showSizeError ? (
            <span role="alert" className="text-danger">
              Pick a size first.
            </span>
          ) : size ? (
            selectedStock <= LOW_STOCK_AT ? (
              <span className="text-danger">
                {selectedStock === 1 ? 'Last one' : `Only ${selectedStock} left`} in{' '}
                {size}.
              </span>
            ) : (
              <span className="text-ash">In stock in {size}, ready to ship.</span>
            )
          ) : (
            <span className="text-ash">
              Oversized fit — take your usual size for the drop, one down for a boxy fit.
            </span>
          )}
        </p>
      </div>

      <div ref={inlineRef} className="mt-6">
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={btn('primary', 'lg', 'w-full')}
        >
          {soldOut ? (
            'Sold out — no restock'
          ) : added ? (
            <>
              <CheckIcon className="h-4 w-4" /> Added to cart
            </>
          ) : (
            'Add to cart'
          )}
        </button>
        <p className="text-ash mt-3 text-center text-xs">
          Free standard shipping over {formatAudCompact(FREE_SHIPPING_THRESHOLD_AUD)} ·
          30-day returns
        </p>
      </div>

      {/* Sticky phone bar. Desktop never sees it. */}
      <div
        className={cn(
          'border-ink-line bg-ink/95 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-md transition-transform duration-300 lg:hidden',
          inlineVisible ? 'translate-y-full' : 'translate-y-0',
        )}
        // `inert` keeps it out of the tab order while it is off-screen.
        inert={inlineVisible}
      >
        <div className="shell flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-sm uppercase">{product.name}</p>
            <Price product={product} size="sm" showSaving={false} className="mt-0.5" />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className={btn('primary', 'md', 'shrink-0')}
          >
            {soldOut ? 'Sold out' : size ? `Add ${size}` : 'Add to cart'}
          </button>
        </div>
      </div>

      <span className="sr-only" role="status">
        {added && size ? `${product.name}, size ${size}, added to your cart.` : ''}
      </span>
    </>
  );
}
