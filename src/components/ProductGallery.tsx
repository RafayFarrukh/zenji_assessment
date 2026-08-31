'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';

type Shot = { src: string; label: string; alt: string };

function shots(product: Product): Shot[] {
  const { images, name, colourway } = product;
  return [
    {
      src: images.front,
      label: 'Front',
      alt: `${name} in ${colourway}, front print, worn by a model`,
    },
    {
      src: images.back,
      label: 'Back',
      alt: `${name} in ${colourway}, back print in detail`,
    },
    {
      src: images.full,
      label: 'Full',
      alt: `${name} in ${colourway}, full length from behind showing the oversized fit`,
    },
    { src: images.poster, label: 'Artwork', alt: `${name} print artwork` },
    { src: images.street, label: 'Worn', alt: `${name} photographed on the street` },
  ];
}

/**
 * One main frame plus a thumbnail rail — vertical beside the image on desktop,
 * horizontal beneath it on mobile. Deliberately not a duplicated
 * desktop/mobile carousel: that ships two copies of every image to every
 * device. Swipe is wired up on the main frame so phones still get the gesture.
 */
export function ProductGallery({ product }: { product: Product }) {
  const frames = shots(product);
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const step = (delta: number) =>
    setActive((i) => Math.min(frames.length - 1, Math.max(0, i + delta)));

  return (
    <div
      className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4"
      style={{ '--accent': product.accent } as React.CSSProperties}
    >
      <div
        // Where the flying copy of the product image launches from on add.
        data-fly-source
        className="bg-ink-raised relative aspect-[4/5] flex-1 overflow-hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${product.name} photography`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX;
          if (start == null || end == null) return;
          if (Math.abs(end - start) > 48) step(end < start ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {frames.map((frame, i) => (
          <Image
            key={frame.src}
            src={frame.src}
            alt={i === active ? frame.alt : ''}
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : 'lazy'}
            sizes="(min-width: 1024px) 46vw, 100vw"
            aria-hidden={i !== active}
            className={cn(
              'object-cover transition-opacity duration-300 ease-out',
              i === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        <p className="label bg-ink/70 text-ash absolute right-3 bottom-3 px-2 py-1 backdrop-blur-sm">
          {active + 1} / {frames.length}
        </p>
      </div>

      {/* min-w-0 lets this scroll on a phone. Without it the rail's 448px
          min-content width sets the grid track and the whole page overflows. */}
      <ul className="hide-scrollbar flex min-w-0 gap-3 overflow-x-auto lg:w-24 lg:shrink-0 lg:flex-col lg:overflow-visible">
        {frames.map((frame, i) => (
          <li key={frame.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              aria-label={`Show ${frame.label.toLowerCase()} view`}
              className={cn(
                'bg-ink-raised relative block aspect-[4/5] w-20 overflow-hidden transition-opacity lg:w-24',
                i === active ? 'opacity-100' : 'opacity-50 hover:opacity-100',
              )}
            >
              <Image
                src={frame.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                loading="lazy"
              />
              {i === active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px]"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
