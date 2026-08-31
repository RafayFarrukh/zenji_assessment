import { cn } from '@/lib/cn';

/**
 * Native `<details>` — no client JavaScript, keyboard and screen-reader
 * behaviour for free, and it still works if the bundle never arrives.
 *
 * The `accordion` class opts into the height transition in globals.css, which
 * is behind `@supports (interpolate-size: allow-keywords)`. Browsers without it
 * still open and close, just instantly.
 */
export function Accordion({
  items,
  className,
}: {
  items: Array<{ id?: string; title: string; body: React.ReactNode }>;
  className?: string;
}) {
  return (
    <div className={cn('divide-ink-line border-ink-line divide-y border-y', className)}>
      {items.map((item) => (
        <details key={item.title} id={item.id} className="accordion group">
          <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg uppercase marker:content-none [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden
              className="text-flame relative h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
            >
              <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-current" />
            </span>
          </summary>
          <div className="text-ash [&_a]:text-bone [&_strong]:text-bone pb-6 text-sm leading-relaxed [&_a]:underline">
            {item.body}
          </div>
        </details>
      ))}
    </div>
  );
}
