'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/** 力 strength · 禅 zen · 刃 blade · 道 the way — the brand's own vocabulary. */
const GLYPHS = ['力', '禅', '刃', '道'];

/**
 * Type-set rather than an image: sharp at every size, no request, and the
 * trailing glyph can do something. On hover it cycles the brand's kanji and
 * settles back on 力.
 */
export function Wordmark({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const start = () => {
    if (timer.current) return;
    let step = 0;
    timer.current = setInterval(() => {
      step += 1;
      setIndex(step % GLYPHS.length);
    }, 110);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setIndex(0);
  };

  return (
    <Link
      href="/"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className={cn('group text-bone flex items-baseline gap-2', className)}
      aria-label="ZENJI — home"
    >
      <span className="font-display text-2xl leading-none tracking-[0.14em]">ZENJI</span>
      <span
        aria-hidden
        className="font-jp text-ash group-hover:text-flame w-4 text-sm leading-none transition-colors"
      >
        {GLYPHS[index]}
      </span>
    </Link>
  );
}
