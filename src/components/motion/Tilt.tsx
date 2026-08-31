'use client';

import { useReducedMotion } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { usePointerFine } from '@/components/motion/use-pointer-fine';
import { cn } from '@/lib/cn';

/**
 * Leans the card towards the cursor. The angles are written directly to the
 * node as CSS custom properties rather than through state, so a pointer moving
 * across a grid of these never triggers a React render.
 */
export function Tilt({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on either axis. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const enabled = usePointerFine() && !reduce;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!enabled || !node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    node.dataset.tilting = 'true';
    node.style.setProperty('--tilt-y', `${px * max * 2}deg`);
    node.style.setProperty('--tilt-x', `${-py * max * 2}deg`);
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.dataset.tilting = 'false';
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--tilt-x', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn('tilt-target h-full', className)}
    >
      {children}
    </div>
  );
}
