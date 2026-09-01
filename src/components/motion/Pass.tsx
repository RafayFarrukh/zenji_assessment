'use client';

import { type CSSProperties } from 'react';
import { useInView } from '@/components/motion/use-pass';
import { cn } from '@/lib/cn';

/**
 * Releases "the pass" — the hard-edged wipe defined in globals.css — the first
 * time the element scrolls into view. The animation is pure CSS; this only
 * flips an attribute, so scrolling costs nothing per frame.
 *
 * The observer watches the OUTER wrapper and the wipe is applied to the INNER
 * one. That separation is not cosmetic: Chromium counts a target's own
 * `clip-path` against its `intersectionRatio`, so observing the clipped node
 * would mean observing something that can never report itself as visible.
 *
 * `bar` adds the squeegee — a hairline that runs ahead of the wipe and leaves.
 * Reserve it for section headings; on every element it would be noise.
 */
export function Pass({
  children,
  delay = 0,
  bar = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  bar?: boolean;
  className?: string;
}) {
  const [ref, inView] = useInView();
  const style = { '--pass-delay': `${delay}ms` } as CSSProperties;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {bar && inView && (
        <span
          aria-hidden
          className="pass-bar bg-flame absolute -top-px left-0 z-10 h-px w-full"
          style={style}
        />
      )}
      <div data-pass={inView ? 'in' : 'out'} style={style}>
        {children}
      </div>
    </div>
  );
}
