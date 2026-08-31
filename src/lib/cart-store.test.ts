import { beforeEach, describe, expect, it } from 'vitest';
import { selectCount, useCart } from '@/lib/cart-store';

// blue-flame-tee stock: XS 4, S 9, M 12, L 7, XL 3, XXL 0
// demon-blood-tee stock: XS 2, S 5, M 8, L 4, XL 0, XXL 0

const reset = () => useCart.setState({ items: [], isOpen: false, lastTouched: null });

describe('cart store', () => {
  beforeEach(reset);

  it('adds a line and opens the drawer', () => {
    useCart.getState().add('blue-flame-tee', 'M');
    expect(useCart.getState().items).toEqual([
      { slug: 'blue-flame-tee', size: 'M', qty: 1 },
    ]);
    expect(useCart.getState().isOpen).toBe(true);
  });

  it('merges a repeat add into the existing line', () => {
    useCart.getState().add('blue-flame-tee', 'M');
    useCart.getState().add('blue-flame-tee', 'M', 2);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0]?.qty).toBe(3);
  });

  it('keeps different sizes of the same piece as separate lines', () => {
    useCart.getState().add('blue-flame-tee', 'M');
    useCart.getState().add('blue-flame-tee', 'L');
    expect(useCart.getState().items).toHaveLength(2);
  });

  it('refuses a size that is sold out', () => {
    useCart.getState().add('blue-flame-tee', 'XXL');
    expect(useCart.getState().items).toEqual([]);
  });

  it('caps an add at the units actually on hand', () => {
    useCart.getState().add('demon-blood-tee', 'XS', 99);
    expect(useCart.getState().items[0]?.qty).toBe(2);
  });

  it('caps setQty at stock too', () => {
    useCart.getState().add('demon-blood-tee', 'XS');
    useCart.getState().setQty('demon-blood-tee', 'XS', 50);
    expect(useCart.getState().items[0]?.qty).toBe(2);
  });

  it('removes the line when quantity drops to zero', () => {
    useCart.getState().add('blue-flame-tee', 'M');
    useCart.getState().setQty('blue-flame-tee', 'M', 0);
    expect(useCart.getState().items).toEqual([]);
  });

  it('ignores an unknown product', () => {
    useCart.getState().add('not-a-real-tee', 'M');
    expect(useCart.getState().items).toEqual([]);
  });

  it('removes and clears', () => {
    useCart.getState().add('blue-flame-tee', 'M');
    useCart.getState().add('demon-blood-tee', 'S');
    useCart.getState().remove('blue-flame-tee', 'M');
    expect(useCart.getState().items).toHaveLength(1);
    useCart.getState().clear();
    expect(useCart.getState().items).toEqual([]);
  });

  it('counts units, not lines', () => {
    useCart.getState().add('blue-flame-tee', 'M', 2);
    useCart.getState().add('demon-blood-tee', 'S', 3);
    expect(selectCount(useCart.getState())).toBe(5);
  });
});
