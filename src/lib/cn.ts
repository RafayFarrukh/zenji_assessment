/**
 * Minimal class joiner. Deliberately not `clsx` + `tailwind-merge` — this build
 * never needs to override a Tailwind class from a prop, so two dependencies
 * would buy nothing.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
