'use client';

import Link from 'next/link';
import { CartLine } from '@/components/CartLine';
import { OrderSummary } from '@/components/OrderSummary';
import { btn } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCartHydrated, useCartLines } from '@/lib/cart-store';
import { cartTotals } from '@/lib/pricing';

/** The full-page cart. The drawer is the primary surface; this is the fallback. */
export function CartPageContents() {
  const lines = useCartLines();
  const hydrated = useCartHydrated();
  const totals = cartTotals(
    lines.map((l) => l.item),
    products,
  );

  if (!hydrated) {
    return <div className="min-h-[40vh]" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="border-ink-line mt-10 border px-6 py-16 text-center">
        <h2 className="font-display text-display-m uppercase">Nothing in here yet</h2>
        <p className="text-ash mx-auto mt-3 max-w-[40ch] text-sm">
          Ten pieces in The Origin Drop, four of them on sale. Pick a size and it will
          land here.
        </p>
        <Link href="/drop" className={btn('primary', 'lg', 'mt-8')}>
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <ul className="divide-ink-line border-ink-line divide-y border-y">
          {lines.map(({ item, product }) => (
            <li key={`${item.slug}:${item.size}`}>
              <CartLine item={item} product={product} />
            </li>
          ))}
        </ul>
        <Link
          href="/drop"
          className="label text-ash hover:text-bone mt-6 inline-block underline underline-offset-4"
        >
          ← Keep shopping
        </Link>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <OrderSummary lines={lines} totals={totals} />
          <Link href="/checkout" className={btn('primary', 'lg', 'mt-4 w-full')}>
            Go to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
