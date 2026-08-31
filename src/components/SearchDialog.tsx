'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { products } from '@/data/products';
import { CloseIcon, SearchIcon } from '@/components/ui/icons';
import { Price } from '@/components/ui/Price';
import { cn } from '@/lib/cn';
import { isSoldOut } from '@/lib/pricing';
import type { Product } from '@/lib/types';

/** Ten products, so matching in the browser is instant and needs no index. */
function search(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((product) => {
      const haystack = [
        product.name,
        product.colourway,
        product.collection,
        product.kanji.meaning,
        product.kanji.romaji,
        ...product.tags,
      ]
        .join(' ')
        .toLowerCase();
      const hits = terms.filter((t) => haystack.includes(t)).length;
      return { product, hits, exact: product.name.toLowerCase().startsWith(q) };
    })
    .filter((r) => r.hits === terms.length)
    .sort((a, b) => Number(b.exact) - Number(a.exact))
    .map((r) => r.product);
}

const SUGGESTIONS = ['sale', 'green', 'water', 'demon', 'oversized'];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    // The dialog mounts and paints in the same frame; focus after that.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="bg-ink/80 absolute inset-0 h-full w-full cursor-default backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the drop"
        className="border-ink-line bg-ink relative mx-auto mt-0 flex max-h-full w-full max-w-3xl flex-col border-b lg:mt-[10vh] lg:border"
      >
        <div className="border-ink-line flex items-center gap-3 border-b px-5">
          <SearchIcon className="text-ash h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the drop — name, colour, or tag"
            className="text-bone placeholder:text-ash h-16 w-full bg-transparent text-base focus:outline-none"
            aria-describedby="search-count"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-ash hover:text-bone flex h-11 w-11 shrink-0 items-center justify-center"
            aria-label="Close search"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <p id="search-count" className="sr-only" role="status">
          {query ? `${results.length} results for ${query}` : 'Type to search the drop'}
        </p>

        <div className="max-h-[60vh] overflow-y-auto">
          {!query && (
            <div className="p-5">
              <p className="label text-ash">Try</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="label border-ink-line text-ash hover:border-bone hover:text-bone border px-3 py-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <p className="text-ash p-5 text-sm">
              Nothing matches “{query}”.{' '}
              <Link href="/drop" onClick={onClose} className="text-bone underline">
                Browse all ten pieces
              </Link>
              .
            </p>
          )}

          <ul>
            {results.map((product, i) => (
              <li
                key={product.slug}
                className="pass-now border-ink-line border-t first:border-t-0"
                style={{ '--pass-delay': `${i * 45}ms` } as React.CSSProperties}
              >
                <Link
                  href={`/drop/${product.slug}`}
                  onClick={onClose}
                  className="hover:bg-ink-raised flex items-center gap-4 p-3 transition-colors"
                >
                  <div className="bg-ink-raised relative h-20 w-16 shrink-0 overflow-hidden">
                    <Image
                      src={product.images.front}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight uppercase">
                      {product.name}
                    </p>
                    <p className="label text-ash mt-1">{product.colourway}</p>
                  </div>
                  <div className={cn('text-right', isSoldOut(product) && 'opacity-50')}>
                    <Price product={product} size="sm" showSaving={false} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
