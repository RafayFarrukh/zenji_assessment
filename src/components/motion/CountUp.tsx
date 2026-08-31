'use client';

import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '@/components/motion/use-pass';

/**
 * Counts up to its value the first time it scrolls into view.
 *
 * The final value is what renders on the server, so the markup is correct
 * without JavaScript and the number never changes width mid-count. The reset to
 * zero happens in a layout effect and only while the element is still below the
 * fold, which is what stops it flashing the answer first.
 */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [inViewRef, inView] = useInView();
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useLayoutEffect(() => {
    if (reduce) return;
    const node = nodeRef.current;
    if (node && node.getBoundingClientRect().top > window.innerHeight) setDisplay(0);
  }, [reduce]);

  useEffect(() => {
    if (reduce || started.current || !inView) return;
    started.current = true;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span
      ref={(node) => {
        nodeRef.current = node;
        inViewRef(node);
      }}
      className={className}
    >
      <span className="tabular-nums">
        {prefix}
        {display.toLocaleString('en-AU')}
        {suffix}
      </span>
    </span>
  );
}
