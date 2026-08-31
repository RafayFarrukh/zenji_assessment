import { isOnSale, isSoldOut, unitPrice } from '@/lib/pricing';
import type { Product } from '@/lib/types';

export const FILTERS = [
  { value: 'all', label: 'Everything' },
  { value: 'sale', label: 'On sale' },
  { value: 'in-stock', label: 'In stock' },
] as const;

export const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const;

export type FilterValue = (typeof FILTERS)[number]['value'];
export type SortValue = (typeof SORTS)[number]['value'];

export function parseFilter(value: string | string[] | undefined): FilterValue {
  return FILTERS.some((f) => f.value === value) ? (value as FilterValue) : 'all';
}

export function parseSort(value: string | string[] | undefined): SortValue {
  return SORTS.some((s) => s.value === value) ? (value as SortValue) : 'newest';
}

/** Pure, so it is trivially unit-testable and runs on the server. */
export function applyFilters(
  catalogue: Product[],
  filter: FilterValue,
  sort: SortValue,
): Product[] {
  const filtered = catalogue.filter((product) => {
    if (filter === 'sale') return isOnSale(product);
    if (filter === 'in-stock') return !isSoldOut(product);
    return true;
  });

  const sorted = [...filtered];
  if (sort === 'price-asc') sorted.sort((a, b) => unitPrice(a) - unitPrice(b));
  else if (sort === 'price-desc') sorted.sort((a, b) => unitPrice(b) - unitPrice(a));
  else sorted.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));

  return sorted;
}
