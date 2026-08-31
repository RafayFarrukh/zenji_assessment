import { describe, expect, it } from 'vitest';
import { products, getProduct } from '@/data/products';
import {
  amountToFreeShipping,
  cartTotals,
  discountPct,
  formatAud,
  formatAudCompact,
  isSoldOut,
  savingPerUnit,
  shippingCost,
  unitPrice,
} from '@/lib/pricing';
import type { CartItem } from '@/lib/types';

const blueFlame = getProduct('blue-flame-tee')!; // 39.99, on sale at 33.99
const bushido = getProduct('bushido-tee')!; // 39.99, no sale

describe('formatAud', () => {
  it('always writes the brand’s A$ prefix', () => {
    expect(formatAud(39.99)).toBe('A$39.99');
    expect(formatAud(6)).toBe('A$6.00');
  });

  it('groups thousands', () => {
    expect(formatAud(1234.5)).toBe('A$1,234.50');
  });
});

describe('per-product pricing', () => {
  it('charges the sale price when there is one', () => {
    expect(unitPrice(blueFlame)).toBe(33.99);
    expect(unitPrice(bushido)).toBe(39.99);
  });

  it('reports the saving in dollars and per cent', () => {
    expect(savingPerUnit(blueFlame)).toBe(6);
    expect(discountPct(blueFlame)).toBe(15);
  });

  it('reports no saving on a full-price piece', () => {
    expect(savingPerUnit(bushido)).toBe(0);
    expect(discountPct(bushido)).toBe(0);
  });
});

describe('shipping', () => {
  it('charges standard shipping below the threshold', () => {
    expect(shippingCost(149.99, 'standard')).toBe(9.95);
  });

  it('is free at exactly the threshold', () => {
    expect(shippingCost(150, 'standard')).toBe(0);
  });

  it('always charges for express, even on a large order', () => {
    expect(shippingCost(400, 'express')).toBe(14.95);
  });

  it('counts down the gap to free shipping and stops at zero', () => {
    expect(amountToFreeShipping(120)).toBe(30);
    expect(amountToFreeShipping(150)).toBe(0);
    expect(amountToFreeShipping(999)).toBe(0);
  });
});

describe('cartTotals', () => {
  const line = (slug: string, qty: number): CartItem => ({ slug, size: 'M', qty });

  it('totals an empty cart without charging shipping on nothing', () => {
    expect(cartTotals([], products)).toEqual({
      subtotal: 0,
      savings: 0,
      shipping: 9.95,
      total: 9.95,
    });
  });

  it('adds sale and full price lines and reports the saving', () => {
    const totals = cartTotals(
      [line('blue-flame-tee', 1), line('bushido-tee', 1)],
      products,
    );
    expect(totals.subtotal).toBe(73.98);
    expect(totals.savings).toBe(6);
    expect(totals.shipping).toBe(9.95);
    expect(totals.total).toBe(83.93);
  });

  it('multiplies quantity and drops shipping once past the threshold', () => {
    const totals = cartTotals([line('bushido-tee', 5)], products);
    expect(totals.subtotal).toBe(199.95);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(199.95);
  });

  it('keeps the express fee even when standard would be free', () => {
    const totals = cartTotals([line('bushido-tee', 5)], products, 'express');
    expect(totals.shipping).toBe(14.95);
    expect(totals.total).toBe(214.9);
  });

  it('stays exact to the cent across many lines', () => {
    const totals = cartTotals(
      [line('blue-flame-tee', 3), line('demon-blood-tee', 3), line('bushido-tee', 1)],
      products,
    );
    expect(totals.subtotal).toBe(243.93);
    expect(totals.savings).toBe(36);
  });

  it('ignores a line whose product no longer exists', () => {
    const totals = cartTotals([line('deleted-tee', 2), line('bushido-tee', 1)], products);
    expect(totals.subtotal).toBe(39.99);
  });
});

describe('stock', () => {
  it('does not treat a partially stocked piece as sold out', () => {
    expect(isSoldOut(blueFlame)).toBe(false);
  });

  it('sums every size to decide sold out', () => {
    const empty = { ...bushido, stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 } };
    expect(isSoldOut(empty)).toBe(true);
  });
});

describe('formatAudCompact', () => {
  it('drops the cents when there are none', () => {
    expect(formatAudCompact(150)).toBe('A$150');
    expect(formatAudCompact(6)).toBe('A$6');
  });

  it('keeps them when they matter', () => {
    expect(formatAudCompact(116.01)).toBe('A$116.01');
    expect(formatAudCompact(33.99)).toBe('A$33.99');
  });
});
