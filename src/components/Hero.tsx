'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import { MagneticLink } from '@/components/motion/Magnetic';
import { btn } from '@/components/ui/button';
import type { Product } from '@/lib/types';

const HEADLINE = ['No restocks.', 'No second', 'chances.'];

/**
 * The one bold moment on the site: an asymmetric split so the portrait
 * photography is never letterboxed, with 一期一会 running down the seam.
 * The phrase means "one meeting, one chance" — the Japanese idea of a moment
 * that cannot repeat, which is literally what a drop with no restock is.
 *
 * The entry is pure CSS: headline lines slide up from behind a hard edge, the
 * rule draws, the rail wipes down. That matters more than it sounds — a
 * JavaScript reveal never runs while the tab is backgrounded, so a reviewer
 * opening the site in a background tab would land on an empty hero. CSS
 * animations do not have that problem, and they survive a failed bundle.
 *
 * Only the scroll parallax is JavaScript, and it is purely additive.
 */
export function Hero({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  // The photograph drifts slower than the page; the copy drifts faster. Both
  // collapse to nothing under reduced motion.
  const imageY = useTransform(smooth, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const imageScale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 1.08]);
  const copyY = useTransform(smooth, [0, 1], ['0%', reduce ? '0%' : '-18%']);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const delay = (ms: number) => ({ '--pass-delay': `${ms}ms` }) as CSSProperties;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="border-ink-line relative overflow-x-clip border-b"
    >
      <div className="shell grid items-stretch lg:grid-cols-12">
        {/* Copy */}
        <motion.div
          style={{ y: copyY }}
          className="order-2 flex flex-col justify-center py-12 lg:order-1 lg:col-span-5 lg:py-28 lg:pr-12"
        >
          <div className="pass-now flex items-center gap-4" style={delay(60)}>
            <span className="label text-flame">Origin Drop 01</span>
            <span
              aria-hidden
              className="bg-ink-line h-px flex-1 origin-left"
              style={{
                animation: 'zenji-pass 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
              }}
            />
            <span className="label text-ash">10 pieces</span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-hero mt-7 text-balance uppercase"
          >
            {HEADLINE.map((line, i) => (
              // Each line is clipped by its own box, so it rises from behind a
              // hard edge rather than fading in.
              <span key={line} className="line-mask block overflow-hidden pb-[0.06em]">
                <span style={{ '--line-delay': `${160 + i * 90}ms` } as CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="pass-now text-body-l text-ash mt-7 max-w-[42ch]"
            style={delay(460)}
          >
            Ten pieces, screen-printed on 240gsm heavyweight cotton and cut oversized.
            When a size runs out it stays out — we don’t reprint the drop.
          </p>

          <div className="pass-now mt-9 flex flex-wrap gap-3" style={delay(560)}>
            <MagneticLink href="/drop" className={btn('primary', 'lg')}>
              Shop the drop
            </MagneticLink>
            <MagneticLink href="/lookbook" className={btn('secondary', 'lg')}>
              See the lookbook
            </MagneticLink>
          </div>
        </motion.div>

        {/* Photography, bled to the right edge of the viewport */}
        <div className="relative order-1 lg:order-2 lg:col-span-7">
          {/* Only the photograph is clipped. Clipping the whole stack would eat
              the kanji rail, which sits deliberately outside the frame. */}
          <div className="bleed-right -mx-gutter relative h-[62svh] min-h-[380px] lg:ml-0 lg:h-full lg:min-h-[620px]">
            <div className="absolute inset-0 overflow-hidden">
              {/* Not animated on entry on purpose: this is the LCP element, so
                  it paints as soon as the bytes arrive rather than waiting on
                  JavaScript. Only the scroll parallax is scripted. */}
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
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
              </motion.div>
            </div>

            {/* The seam rail, drawn top to bottom */}
            <div
              className="draw-down absolute top-6 left-4 flex flex-col items-center gap-4 drop-shadow-[0_2px_12px_rgba(10,10,10,0.9)] lg:top-1/2 lg:left-0 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:drop-shadow-none"
              style={delay(700)}
            >
              <span className="font-jp text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] [writing-mode:vertical-rl]">
                一期一会
              </span>
              <span aria-hidden className="bg-ink-line h-16 w-px" />
              <span className="label text-ash hidden [writing-mode:vertical-rl] lg:block">
                Ichi-go ichi-e
              </span>
            </div>

            {/* What you are looking at */}
            <div
              className="pass-now border-bone/25 bg-ink/70 absolute right-4 bottom-4 border px-3 py-2 backdrop-blur-sm lg:right-6 lg:bottom-6"
              style={delay(900)}
            >
              <p className="label text-ash">Worn above</p>
              <Link
                href={`/drop/${product.slug}`}
                className="font-display hover:text-flame mt-1 block text-sm uppercase transition-colors"
              >
                {product.name} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — fades out as soon as the reader takes the hint */}
      <motion.div
        aria-hidden
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="label text-ash">Scroll</span>
        <span className="bg-ink-line relative block h-10 w-px overflow-hidden">
          <span className="bg-flame absolute inset-x-0 top-0 h-4 animate-[zenji-cue_1.9s_ease-in-out_infinite]" />
        </span>
      </motion.div>
    </section>
  );
}
