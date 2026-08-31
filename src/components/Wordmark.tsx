import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Type-set rather than an image: it stays sharp at every size, costs no
 * request, and the 力 ("strength") glyph is the brand's own motif.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('group text-bone flex items-baseline gap-2', className)}
      aria-label="ZENJI — home"
    >
      <span className="font-display text-2xl leading-none tracking-[0.14em]">ZENJI</span>
      <span
        aria-hidden
        className="font-jp text-ash group-hover:text-flame text-sm leading-none transition-colors"
      >
        力
      </span>
    </Link>
  );
}
