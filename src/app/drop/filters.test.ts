import { describe, expect, it } from 'vitest';
import { products } from '@/data/products';
import { applyFilters, parseFilter, parseSort } from '@/app/drop/filters';
import { isOnSale, unitPrice } from '@/lib/pricing';

describe('search param parsing', () => {
  it('falls back to sane defaults for junk input', () => {
    expect(parseFilter('nonsense')).toBe('all');
    expect(parseFilter(undefined)).toBe('all');
    expect(parseSort(['price-asc'])).toBe('newest');
  });

  it('accepts the values it advertises', () => {
    expect(parseFilter('sale')).toBe('sale');
    expect(parseSort('price-desc')).toBe('price-desc');
  });
});

describe('applyFilters', () => {
  it('returns the whole drop by default', () => {
    expect(applyFilters(products, 'all', 'newest')).toHaveLength(products.length);
  });

  it('keeps only sale pieces', () => {
    const result = applyFilters(products, 'sale', 'newest');
    expect(result).toHaveLength(4);
    expect(result.every(isOnSale)).toBe(true);
  });

  it('sorts by the price the customer actually pays', () => {
    const prices = applyFilters(products, 'all', 'price-asc').map(unitPrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(prices[0]).toBe(33.99);
  });

  it('sorts newest first by release date', () => {
    const dates = applyFilters(products, 'all', 'newest').map((p) => p.releasedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('does not mutate the catalogue it was given', () => {
    const order = products.map((p) => p.slug);
    applyFilters(products, 'all', 'price-desc');
    expect(products.map((p) => p.slug)).toEqual(order);
  });
});
