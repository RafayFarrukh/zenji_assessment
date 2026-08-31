import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 border font-display uppercase ' +
  'tracking-[0.08em] transition-colors duration-150 select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame ' +
  'disabled:cursor-not-allowed disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary: 'border-flame bg-flame text-bone hover:border-flame-hi hover:bg-flame-hi',
  secondary: 'border-bone bg-transparent text-bone hover:bg-bone hover:text-ink',
  ghost: 'border-ink-line bg-transparent text-ash hover:border-bone hover:text-bone',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-[16px]',
};

/** Shared button skin, so a `<Link>` and a `<button>` can look identical. */
export function btn(
  variant: Variant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
) {
  return cn(base, variants[variant], sizes[size], extra);
}
