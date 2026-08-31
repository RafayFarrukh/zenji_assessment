'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

type PassState = 'out' | 'in';

/**
 * One IntersectionObserver for the whole page rather than one per element —
 * a product grid alone would otherwise create forty of them.
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  return observer;
}

/**
 * Fires once, the first time the element reaches the viewport. Anything already
 * on screen at mount — a deep link, a restored scroll position — resolves
 * immediately rather than waiting for a scroll that may never come.
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

export type PassProps = {
  ref: (node: HTMLElement | null) => void;
  'data-pass': PassState;
  style: CSSProperties;
};

/**
 * Releases "the pass" — the hard-edged wipe defined in globals.css — the first
 * time an element scrolls into view. The animation itself is pure CSS, so
 * scrolling costs nothing per frame; this only flips an attribute.
 *
 * Anything above the fold should be left out of this: the markup ships with the
 * element clipped, and a root <noscript> rule is what saves it if the bundle
 * never arrives.
 */
export function usePass(delay = 0): PassProps {
  const [ref, inView] = useInView();

  return {
    ref,
    'data-pass': inView ? 'in' : 'out',
    style: { '--pass-delay': `${delay}ms` } as CSSProperties,
  };
}
