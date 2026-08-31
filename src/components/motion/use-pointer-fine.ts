'use client';

import { useEffect, useState } from 'react';

/**
 * True only for a real hovering cursor. Everything pointer-driven — magnetic
 * buttons, card tilt — is gated on this: on a touch screen those effects have
 * nothing to follow and just fight the tap.
 *
 * Starts false so the server HTML and the first client render agree.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine)');
    const update = () => setFine(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return fine;
}
