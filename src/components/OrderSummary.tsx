import Image from 'next/image';
import { FreeShippingMeter } from '@/components/FreeShippingMeter';
import { formatAud, unitPrice } from '@/lib/pricing';
import type { CartItem, Product, Totals } from '@/lib/types';

/**
 * Presentational only — it renders totals that `cartTotals()` already worked
 * out. It never does money maths itself.
 */
export function OrderSummary({
  lines,
  totals,
  showMeter = true,
}: {
  lines: Array<{ item: CartItem; product: Product }>;
  totals: Totals;
  showMeter?: boolean;
}) {
  return (
    <div className="border-ink-line border">
      <h2 className="border-ink-line font-display border-b px-5 py-4 text-lg uppercase">
        Order summary
      </h2>

      <ul className="divide-ink-line divide-y px-5">
        {lines.map(({ item, product }) => (
          <li key={`${item.slug}:${item.size}`} className="flex gap-4 py-4">
            <div className="bg-ink-raised relative aspect-[4/5] w-14 shrink-0 overflow-hidden">
              <Image
                src={product.images.front}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="bg-flame font-display text-bone absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 text-[11px]">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm uppercase">{product.name}</p>
              <p className="label text-ash mt-1">Size {item.size}</p>
            </div>
            <p className="font-display shrink-0 text-sm">
              {formatAud(unitPrice(product) * item.qty)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="border-ink-line space-y-3 border-t px-5 py-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ash">Subtotal</dt>
          <dd>{formatAud(totals.subtotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="text-flame flex justify-between">
            <dt>Drop savings</dt>
            <dd>−{formatAud(totals.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ash">Shipping</dt>
          <dd>{totals.shipping === 0 ? 'Free' : formatAud(totals.shipping)}</dd>
        </div>
        <div className="border-ink-line flex items-baseline justify-between border-t pt-4">
          <dt className="label text-ash">Total (incl. GST)</dt>
          <dd className="font-display text-2xl">{formatAud(totals.total)}</dd>
        </div>
      </dl>

      {showMeter && (
        <div className="border-ink-line border-t px-5 py-4">
          <FreeShippingMeter subtotal={totals.subtotal} />
        </div>
      )}
    </div>
  );
}
