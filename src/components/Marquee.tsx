'use client';

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';
import { useRef } from 'react';

const MESSAGES = [
  'The Origin Drop — ten pieces, no restocks',
  'Free shipping Australia-wide over A$150',
  'New in: Water Breathing Tee',
  'Printed and packed in Melbourne',
];

/** Percent of the track width travelled per second at rest. */
const BASE_SPEED = 2.4;

/**
 * Announcement bar that answers to the page. At rest it drifts; scrolling down
 * drives it faster, scrolling up reverses it. The list is rendered twice and
 * the track wraps at -50%, which loops seamlessly at any viewport width — the
 * duplicate is hidden from assistive tech so the messages are announced once.
 *
 * Under reduced motion it simply stops.
 */
export function Marquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * BASE_SPEED * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="border-ink-line bg-ink-raised border-b">
      <div className="hide-scrollbar overflow-hidden">
        <motion.div
          data-marquee
          style={{ x }}
          className="flex w-max will-change-transform"
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="label text-ash flex shrink-0 items-center"
              aria-hidden={copy === 1 || undefined}
            >
              {MESSAGES.map((message) => (
                <li key={message} className="flex items-center py-2.5">
                  <span className="px-6">{message}</span>
                  <span aria-hidden className="text-flame">
                    ◆
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
