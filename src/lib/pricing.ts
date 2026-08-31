import {
  EXPRESS_SHIPPING_AUD,
  FREE_SHIPPING_THRESHOLD_AUD,
  STANDARD_SHIPPING_AUD,
} from '@/data/products';
import type { CartItem, Product, ShippingMethod, Size, Totals } from '@/lib/types';

const aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  currencyDisplay: 'narrowSymbol',
});

/** The only place a price becomes a string. `39.99` -> `"A$39.99"`. */
export function formatAud(value: number): string {
  // en-AU renders narrowSymbol as "$"; the brand always writes A$.
  return `A${aud.format(round(value))}`;
}

/**
 * For thresholds and marketing copy, where trailing `.00` is noise:
 * `150` -> `"A$150"`, but `116.01` -> `"A$116.01"`.
 */
export function formatAudCompact(value: number): string {
  const rounded = round(value);
  return Number.isInteger(rounded)
    ? `A$${rounded.toLocaleString('en-AU')}`
    : formatAud(rounded);
}

/** Money is held as AUD floats, so every derived figure is re-rounded to cents. */
function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** What the customer actually pays today for one unit. */
export function unitPrice(product: Product): number {
  return product.salePriceAud ?? product.priceAud;
}

/** Dollars saved per unit. `0` when the piece is not on sale. */
export function savingPerUnit(product: Product): number {
  return product.salePriceAud ? round(product.priceAud - product.salePriceAud) : 0;
}

/** Whole-number percentage off, for the badge. */
export function discountPct(product: Product): number {
  if (!product.salePriceAud) return 0;
  return Math.round((1 - product.salePriceAud / product.priceAud) * 100);
}

export function isOnSale(product: Product): boolean {
  return product.salePriceAud !== undefined;
}

export function stockFor(product: Product, size: Size): number {
  return product.stock[size];
}

export function totalStock(product: Product): number {
  return Object.values(product.stock).reduce((sum, n) => sum + n, 0);
}

export function isSoldOut(product: Product): boolean {
  return totalStock(product) === 0;
}

/** Under this many units left we tell the customer, which is the whole point of a drop. */
export const LOW_STOCK_AT = 4;

export function shippingCost(subtotal: number, method: ShippingMethod): number {
  if (method === 'express') return EXPRESS_SHIPPING_AUD;
  return subtotal >= FREE_SHIPPING_THRESHOLD_AUD ? 0 : STANDARD_SHIPPING_AUD;
}

/** Dollars still to spend before standard shipping is free. */
export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, round(FREE_SHIPPING_THRESHOLD_AUD - subtotal));
}

/**
 * The single source of truth for cart maths. Components never add prices up
 * themselves — they call this and render the result.
 */
export function cartTotals(
  items: CartItem[],
  catalogue: Product[],
  method: ShippingMethod = 'standard',
): Totals {
  let subtotal = 0;
  let savings = 0;

  for (const item of items) {
    const product = catalogue.find((p) => p.slug === item.slug);
    if (!product) continue;
    subtotal += unitPrice(product) * item.qty;
    savings += savingPerUnit(product) * item.qty;
  }

  subtotal = round(subtotal);
  const shipping = shippingCost(subtotal, method);

  return {
    subtotal,
    savings: round(savings),
    shipping: round(shipping),
    total: round(subtotal + shipping),
  };
}
