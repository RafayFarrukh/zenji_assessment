'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { btn } from '@/components/ui/button';
import type { Product } from '@/lib/types';

const HEADLINE = ['No restocks.', 'No second', 'chances.'];
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The one bold moment on the site: an asymmetric split so the portrait
 * photography is never letterboxed, with 一期一会 running down the seam.
 * The phrase means "one meeting, one chance" — the Japanese idea of a moment
 * that cannot repeat, which is literally what a drop with no restock is.
 *
 * Motion is a single orchestrated reveal on load. Each element carries its own
 * delay rather than inheriting a stagger, so the sequence is explicit and does
 * not depend on variant propagation through the tree. Nothing else on the home
 * page animates, and the whole thing collapses to a short fade under reduced
 * motion.
 */
export function Hero({ product }: { product: Product }) {
  const reduce = useReducedMotion();

  /** Fade-and-rise with an explicit place in the sequence. */
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.2 : 0.7,
      delay: reduce ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="border-ink-line relative overflow-x-clip border-b"
    >
      {/* The reveal is server-rendered as inline opacity:0. If the bundle never
          arrives, the headline must still be readable. */}
      <noscript>
        <style>{`#hero [style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <div className="shell grid items-stretch lg:grid-cols-12">
        {/* Copy */}
        <div className="order-2 flex flex-col justify-center py-12 lg:order-1 lg:col-span-5 lg:py-28 lg:pr-12">
          <motion.div {...rise(0.05)} className="flex items-center gap-4">
            <span className="label text-flame">Origin Drop 01</span>
            <motion.span
              aria-hidden
              initial={{ scaleX: reduce ? 1 : 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0.2 : 0.8, delay: 0.15, ease: 'easeOut' }}
              className="bg-ink-line h-px flex-1 origin-left"
            />
            <span className="label text-ash">10 pieces</span>
          </motion.div>

          <h1
            id="hero-heading"
            className="font-display text-hero mt-7 text-balance uppercase"
          >
            {HEADLINE.map((line, i) => (
              <motion.span key={line} {...rise(0.15 + i * 0.08)} className="block">
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p {...rise(0.42)} className="text-body-l text-ash mt-7 max-w-[42ch]">
            Ten pieces, screen-printed on 240gsm heavyweight cotton and cut oversized.
            When a size runs out it stays out — we don’t reprint the drop.
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-9 flex flex-wrap gap-3">
            <Link href="/drop" className={btn('primary', 'lg')}>
              Shop the drop
            </Link>
            <Link href="/lookbook" className={btn('secondary', 'lg')}>
              See the lookbook
            </Link>
          </motion.div>
        </div>

        {/* Photography, bled to the right edge of the viewport */}
        <div className="relative order-1 lg:order-2 lg:col-span-7">
          <div className="bleed-right -mx-gutter relative h-[62svh] min-h-[380px] lg:ml-0 lg:h-full lg:min-h-[620px]">
            {/* Not animated on purpose: this is the LCP element, so it paints
                as soon as the bytes arrive rather than waiting on JavaScript. */}
            <div className="absolute inset-0">
              <Image
                src={product.images.street}
                alt={`${product.name} worn in ${product.colourway}, photographed on the street`}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="object-cover object-[50%_38%]"
              />
              <span
                aria-hidden
                className="from-ink/70 via-ink/10 lg:from-ink lg:via-ink/0 absolute inset-0 bg-gradient-to-r to-transparent"
              />
            </div>

            {/* The seam rail. Deliberately outside the reveal: it is the one
                piece of brand copy in the hero and must never depend on JS. */}
            <div className="absolute top-6 left-4 flex flex-col items-center gap-4 drop-shadow-[0_2px_12px_rgba(10,10,10,0.9)] lg:top-1/2 lg:left-0 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:drop-shadow-none">
              <span className="font-jp text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] [writing-mode:vertical-rl]">
                一期一会
              </span>
              <span aria-hidden className="bg-ink-line h-16 w-px" />
              <span className="label text-ash hidden [writing-mode:vertical-rl] lg:block">
                Ichi-go ichi-e
              </span>
            </div>

            {/* What you are looking at */}
            <div className="border-bone/25 bg-ink/70 absolute right-4 bottom-4 border px-3 py-2 backdrop-blur-sm lg:right-6 lg:bottom-6">
              <p className="label text-ash">Worn above</p>
              <Link
                href={`/drop/${product.slug}`}
                className="font-display hover:text-flame mt-1 block text-sm uppercase"
              >
                {product.name} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
