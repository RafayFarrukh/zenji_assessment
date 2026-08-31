'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { NAV_LINKS } from '@/components/nav-links';
import { Wordmark } from '@/components/Wordmark';
import { CloseIcon } from '@/components/ui/icons';

/**
 * Full-screen panel rather than a slide-in sheet: at 360px a sheet leaves a
 * useless 40px of page behind it. Focus moves to the close button on open and
 * Escape closes, same contract as the cart drawer.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="bg-ink fixed inset-0 z-50 flex flex-col lg:hidden"
    >
      <div className="shell border-ink-line flex h-16 shrink-0 items-center justify-between border-b">
        <Wordmark />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="text-bone flex h-11 w-11 items-center justify-center"
          aria-label="Close menu"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="shell flex-1 overflow-y-auto py-8">
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="border-ink-line border-b">
              <Link
                href={link.href}
                onClick={onClose}
                className="font-display text-display-m text-bone flex items-baseline gap-4 py-5 uppercase"
              >
                <span className="label text-ash w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="label text-ash mt-10">Every drop limited. No restocks. Ever.</p>
      </nav>
    </div>
  );
}
