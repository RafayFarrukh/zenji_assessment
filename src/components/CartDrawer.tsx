'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CartLine } from '@/components/CartLine';
import { FreeShippingMeter } from '@/components/FreeShippingMeter';
import { btn } from '@/components/ui/button';
import { CloseIcon } from '@/components/ui/icons';
import { products } from '@/data/products';
import { useCart, useCartHydrated, useCartLines } from '@/lib/cart-store';
import { cartTotals, formatAud, formatAudCompact } from '@/lib/pricing';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Primary cart surface. `/cart` exists as a real page for deep links and for
 * anyone who lands there with JavaScript still loading, but this is what people
 * actually use.
 *
 * Accessibility contract: it is a modal dialog, focus moves in on open and back
 * to the trigger on close, Tab is trapped inside, Escape closes.
 */
export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCartLines();
  const hydrated = useCartHydrated();
  const reduce = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const totals = cartTotals(
    lines.map((l) => l.item),
    products,
  );

  useEffect(() => {
    if (!isOpen) return;

    returnFocusTo.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      returnFocusTo.current?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-ink/70 absolute inset-0 h-full w-full cursor-default backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="border-ink-line bg-ink absolute inset-y-0 right-0 flex w-full max-w-[27rem] flex-col border-l shadow-[0_0_60px_rgba(0,0,0,0.6)]"
          >
            <div className="border-ink-line flex h-16 shrink-0 items-center justify-between border-b pr-1 pl-5">
              <h2 className="font-display text-xl uppercase">Your cart</h2>
              <button
                type="button"
                onClick={close}
                className="text-ash hover:text-bone flex h-11 w-11 items-center justify-center"
                aria-label="Close cart"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {!hydrated ? (
              <div className="flex-1" />
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-display text-display-m uppercase">
                  Nothing in here yet
                </p>
                <p className="text-ash max-w-[30ch] text-sm">
                  Ten pieces in The Origin Drop, and four of them are on sale right now.
                </p>
                <Link href="/drop" onClick={close} className={btn('primary')}>
                  Shop the drop
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-ink-line flex-1 divide-y overflow-y-auto px-5">
                  {lines.map(({ item, product }) => (
                    <CartLine
                      key={`${item.slug}:${item.size}`}
                      item={item}
                      product={product}
                      onNavigate={close}
                      compact
                    />
                  ))}
                </div>

                <div className="border-ink-line shrink-0 space-y-4 border-t p-5">
                  <FreeShippingMeter subtotal={totals.subtotal} />

                  <div className="flex items-baseline justify-between">
                    <span className="label text-ash">Subtotal</span>
                    <span className="font-display text-2xl">
                      {formatAud(totals.subtotal)}
                    </span>
                  </div>

                  {totals.savings > 0 && (
                    <p className="label text-flame">
                      You’re saving {formatAudCompact(totals.savings)}
                    </p>
                  )}

                  <Link
                    href="/checkout"
                    onClick={close}
                    className={btn('primary', 'lg', 'w-full')}
                  >
                    Go to checkout
                  </Link>
                  <p className="text-ash text-center text-xs">
                    Shipping and taxes calculated at checkout.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
