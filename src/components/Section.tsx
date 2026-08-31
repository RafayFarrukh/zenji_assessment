import Link from 'next/link';
import { cn } from '@/lib/cn';

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-ink-line flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b pb-5',
        className,
      )}
    >
      <div>
        <p className="label text-flame">{eyebrow}</p>
        <h2 className="font-display text-display-l mt-3 uppercase">{title}</h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="label border-ink-line text-ash hover:border-bone hover:text-bone border-b pb-1 transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
