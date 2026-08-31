'use client';

import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { usePointerFine } from '@/components/motion/use-pointer-fine';

const SPRING = { stiffness: 260, damping: 18, mass: 0.35 };
/** How far the control is allowed to chase the cursor, in px. */
const PULL = 9;

function useMagnet() {
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const enabled = fine && !reduce;

  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * PULL);
    y.set(Math.max(-1, Math.min(1, dy)) * PULL);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    style: { x, y },
    onPointerMove,
    onPointerLeave: release,
    onBlur: release,
  };
}

/**
 * The control leans towards the cursor and springs back when it leaves.
 * Desktop only, and the wrapper never intercepts the click — the anchor still
 * fills it, so keyboard and screen-reader behaviour is untouched.
 */
export function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const magnet = useMagnet();
  return (
    <motion.span {...magnet} className="inline-flex">
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}

export function MagneticButton({
  className,
  children,
  onClick,
  disabled,
  type = 'button',
  full = false,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  full?: boolean;
}) {
  const magnet = useMagnet();
  return (
    <motion.span {...magnet} className={full ? 'flex w-full' : 'inline-flex'}>
      <button type={type} onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    </motion.span>
  );
}
