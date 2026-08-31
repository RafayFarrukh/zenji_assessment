'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getProduct } from '@/data/products';
import type { CartItem, Size } from '@/lib/types';

type CartState = {
  items: CartItem[];
  /** Drawer visibility. Never persisted — nobody wants the drawer open on load. */
  isOpen: boolean;
  /** Key of the line we just touched, so the drawer can flash it. */
  lastTouched: string | null;
  /** Adds stock-capped units. Opening the drawer is the caller's decision. */
  add: (slug: string, size: Size, qty?: number) => void;
  setQty: (slug: string, size: Size, qty: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const lineKey = (slug: string, size: Size) => `${slug}:${size}`;

/** Never let the cart hold more units than the drop actually has. */
function capToStock(slug: string, size: Size, qty: number): number {
  const product = getProduct(slug);
  if (!product) return 0;
  return Math.max(0, Math.min(qty, product.stock[size]));
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastTouched: null,

      add: (slug, size, qty = 1) => {
        const existing = get().items.find((i) => i.slug === slug && i.size === size);
        const nextQty = capToStock(slug, size, (existing?.qty ?? 0) + qty);
        if (nextQty === 0) return;

        set((state) => ({
          items: existing
            ? state.items.map((i) =>
                i.slug === slug && i.size === size ? { ...i, qty: nextQty } : i,
              )
            : [...state.items, { slug, size, qty: nextQty }],
          lastTouched: lineKey(slug, size),
        }));
      },

      setQty: (slug, size, qty) => {
        const next = capToStock(slug, size, qty);
        if (next <= 0) {
          get().remove(slug, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug && i.size === size ? { ...i, qty: next } : i,
          ),
          lastTouched: lineKey(slug, size),
        }));
      },

      remove: (slug, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.slug === slug && i.size === size)),
          lastTouched: null,
        })),

      clear: () => set({ items: [], lastTouched: null }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'zenji-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only the contents survive a reload.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.qty, 0);

/**
 * The server renders an empty cart; localStorage only exists in the browser.
 * Anything that shows cart contents waits on this so the first paint matches
 * the server HTML and React never warns about a hydration mismatch.
 */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // zustand only attaches the persist API when it found a storage to use, so
    // this is undefined during prerender and in a browser with storage blocked.
    // Either way there is nothing to wait for.
    const persistApi = useCart.persist as typeof useCart.persist | undefined;
    if (!persistApi || persistApi.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return persistApi.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

/**
 * Cart contents joined to the catalogue. Lines whose product no longer exists
 * are dropped rather than rendered as a broken row.
 */
export function useCartLines() {
  const items = useCart((s) => s.items);
  return items.flatMap((item) => {
    const product = getProduct(item.slug);
    return product ? [{ item, product }] : [];
  });
}
