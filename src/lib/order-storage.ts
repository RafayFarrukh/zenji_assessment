import type { Order } from '@/lib/types';

const KEY = 'zenji-last-order';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 — these get read aloud

/** `ZJ-7KQ4MP`. Unambiguous characters only, because people quote it in DMs. */
export function generateOrderId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `ZJ-${suffix}`;
}

/**
 * The confirmation page is a normal route, so the order travels in
 * sessionStorage rather than a query string — it survives a refresh, dies with
 * the tab, and keeps the customer's address out of the URL.
 */
export function saveOrder(order: Order): void {
  sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function readOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
