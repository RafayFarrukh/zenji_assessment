'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * One IntersectionObserver for the whole page rather than one per element —
 * a product grid alone would otherwise create forty of them.
 *
 * `threshold: 0` is deliberate and load-bearing. Chromium factors a target's
 * own `clip-path` into `intersectionRatio`, so an element hidden by a clip
 * reports a ratio of 0 no matter how much of it is on screen. Any non-zero
 * threshold on a clipped target therefore deadlocks: it stays hidden because it
 * is hidden. Callers must observe an unclipped node (see `Pass`), and this
 * keeps the second lock off the door as well.
 */
let observer: IntersectionObserver | null = null;
const listeners = new WeakMap<Element, () => void>();

function shared(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        listeners.get(entry.target)?.();
        listeners.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    // Fire a little before the element is fully on screen so the wipe has
    // finished by the time the reader's eye reaches it.
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );
  return observer;
}

/**
 * Fires once, the first time the element reaches the viewport. Anything already
 * on screen at mount — a deep link, a restored scroll position — resolves
 * immediately rather than waiting for a scroll that may never come.
 *
 * Attach this to an element that is never visually clipped.
 */
export function useInView(): [(node: HTMLElement | null) => void, boolean] {
  const [inView, setInView] = useState(false);
  const cleanup = useRef<(() => void) | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!node) return;

    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setInView(true);
      return;
    }

    listeners.set(node, () => setInView(true));
    shared().observe(node);
    cleanup.current = () => {
      listeners.delete(node);
      observer?.unobserve(node);
    };
  }, []);

  useEffect(() => () => cleanup.current?.(), []);

  return [ref, inView];
}
