import { cn } from '@/lib/cn';

type Tone = 'sale' | 'new' | 'soldout' | 'low' | 'quiet';

const tones: Record<Tone, string> = {
  sale: 'bg-bone text-ink',
  new: 'bg-flame text-bone',
  soldout: 'bg-ink/85 text-bone ring-1 ring-inset ring-bone/40 backdrop-blur-[2px]',
  low: 'bg-transparent text-danger ring-1 ring-inset ring-danger/50',
  quiet: 'bg-transparent text-ash ring-1 ring-inset ring-ink-line',
};

export function Badge({
  tone = 'quiet',
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'label inline-flex items-center px-2 py-1 font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
