'use client';

import { cn } from '@/lib/cn';
import { usePass } from '@/components/motion/use-pass';

/**
 * Wrapper form of `usePass`. `bar` adds the squeegee — a hairline that runs
 * ahead of the wipe and leaves. Reserve it for section headings; on every
 * element it would be noise.
 */
export function Pass({
  children,
  delay = 0,
  bar = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  bar?: boolean;
  className?: string;
}) {
  const pass = usePass(delay);

  return (
    <div className={cn('relative', className)}>
      {bar && pass['data-pass'] !== 'out' && (
        <span
          aria-hidden
          className="pass-bar bg-flame absolute -top-px left-0 z-10 h-px w-full"
          style={pass.style}
        />
      )}
      <div {...pass}>{children}</div>
    </div>
  );
}
