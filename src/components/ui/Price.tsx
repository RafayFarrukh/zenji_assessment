import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { formatAud, savingPerUnit } from '@/lib/pricing';
import type { Product } from '@/lib/types';

/**
 * Prices are set in the display face so they read as part of the design.
 * When a piece is on sale we lead with what it costs today and show the saving
 * in dollars — a percentage alone makes people do arithmetic.
 */
export function Price({
  product,
  size = 'md',
  showSaving = true,
  className,
}: {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showSaving?: boolean;
  className?: string;
}) {
  const saving = savingPerUnit(product);
  const onSale = saving > 0;

  const scale = {
    sm: 'text-[15px]',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  return (
    <span className={cn('flex flex-wrap items-baseline gap-x-2.5 gap-y-1', className)}>
      <span className={cn('font-display tracking-tight', scale)}>
        {formatAud(product.salePriceAud ?? product.priceAud)}
      </span>
      {onSale && (
        <>
          <span
            className={cn(
              'font-display text-ash line-through decoration-1',
              size === 'lg' ? 'text-xl' : 'text-[15px]',
            )}
          >
            {formatAud(product.priceAud)}
          </span>
          {showSaving && <Badge tone="sale">Save {formatAud(saving)}</Badge>}
        </>
      )}
    </span>
  );
}
