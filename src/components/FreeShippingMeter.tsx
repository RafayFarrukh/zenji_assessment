import { FREE_SHIPPING_THRESHOLD_AUD } from '@/data/products';
import { amountToFreeShipping, formatAudCompact } from '@/lib/pricing';

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = amountToFreeShipping(subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_AUD) * 100));
  const unlocked = remaining === 0;

  return (
    <div>
      <p className="text-sm">
        {unlocked ? (
          <span className="text-bone">Standard shipping is free on this order.</span>
        ) : (
          <span className="text-ash">
            <span className="text-bone">{formatAudCompact(remaining)}</span> away from
            free standard shipping.
          </span>
        )}
      </p>
      <div
        className="bg-ink-line mt-2.5 h-1 w-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress towards free shipping"
      >
        <div
          className="bg-flame h-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
