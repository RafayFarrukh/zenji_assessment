import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import { products } from '@/data/products';
import { cn } from '@/lib/cn';
import { FILTERS, SORTS, applyFilters, parseFilter, parseSort } from './filters';

export const metadata: Metadata = {
  title: 'The Origin Drop',
  description:
    'All ten pieces in The Origin Drop — oversized 240gsm anime graphic tees in limited stock. Filter by sale or availability and sort by price.',
  alternates: { canonical: '/drop' },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Filtering and sorting live in the URL and are applied on the server, so the
 * page is shareable, crawlable and needs no client JavaScript to work.
 */
export default async function DropPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const sort = parseSort(params.sort);
  const visible = applyFilters(products, filter, sort);

  const href = (next: { filter?: string; sort?: string }) => {
    const query = new URLSearchParams();
    const f = next.filter ?? filter;
    const s = next.sort ?? sort;
    if (f !== 'all') query.set('filter', f);
    if (s !== 'newest') query.set('sort', s);
    const qs = query.toString();
    return qs ? `/drop?${qs}` : '/drop';
  };

  return (
    <div className="shell py-12 lg:py-16">
      <header className="border-ink-line border-b pb-8">
        <p className="label text-flame">Collection 01</p>
        <h1 className="font-display text-display-xl mt-4 uppercase">The Origin Drop</h1>
        <p className="text-body-l text-ash mt-6 max-w-[56ch]">
          Ten pieces cut oversized in 240gsm heavyweight cotton, garment washed and
          screen-printed front and back. Limited stock — when a size goes, it goes.
        </p>
      </header>

      <div className="border-ink-line flex flex-col gap-6 border-b py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="label sr-only">Filter</h2>
          <ul className="flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const active = option.value === filter;
              return (
                <li key={option.value}>
                  <Link
                    href={href({ filter: option.value })}
                    scroll={false}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'label inline-flex h-10 items-center border px-4 transition-colors',
                      active
                        ? 'border-bone bg-bone text-ink'
                        : 'border-ink-line text-ash hover:border-bone hover:text-bone',
                    )}
                  >
                    {option.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="label text-ash">Sort</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {SORTS.map((option) => {
              const active = option.value === sort;
              return (
                <li key={option.value}>
                  <Link
                    href={href({ sort: option.value })}
                    scroll={false}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'label border-b pb-1 transition-colors',
                      active
                        ? 'border-flame text-bone'
                        : 'text-ash hover:text-bone border-transparent',
                    )}
                  >
                    {option.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="label text-ash py-6" role="status">
        {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
        {filter !== 'all' && ` · ${FILTERS.find((f) => f.value === filter)?.label}`}
      </p>

      {visible.length > 0 ? (
        <ProductGrid products={visible} priorityCount={4} />
      ) : (
        <div className="border-ink-line border p-10 text-center">
          <p className="font-display text-display-m uppercase">Nothing matches that</p>
          <p className="text-ash mt-3 text-sm">
            Try{' '}
            <Link href="/drop" className="text-bone underline">
              the full drop
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
