'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/components/MobileNav';
import { SearchDialog } from '@/components/SearchDialog';
import { Wordmark } from '@/components/Wordmark';
import { NAV_LINKS } from '@/components/nav-links';
import { BagIcon, MenuIcon, SearchIcon } from '@/components/ui/icons';
import { selectCount, useCart, useCartHydrated } from '@/lib/cart-store';
import { cn } from '@/lib/cn';

const iconButton =
  'flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-flame';

export function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const hydrated = useCartHydrated();

  // Route change closes anything we left open.
  useEffect(() => {
    setNavOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // ⌘K / Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="border-ink-line bg-ink/90 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <div className="flex items-center gap-10">
            <Wordmark />
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((link) => {
                  const active = pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'label border-b py-1 transition-colors',
                          active
                            ? 'border-flame text-bone'
                            : 'text-ash hover:text-bone border-transparent',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconButton}
              aria-label="Search the drop"
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={openCart}
              className={cn(iconButton, 'relative')}
              aria-label={
                hydrated && count > 0
                  ? `Open cart, ${count} item${count === 1 ? '' : 's'}`
                  : 'Open cart'
              }
            >
              <BagIcon className="h-5 w-5" />
              {hydrated && count > 0 && (
                <span className="bg-flame font-display text-bone absolute top-1 right-0.5 min-w-[18px] px-1 py-0.5 text-center text-[11px] leading-none">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className={cn(iconButton, 'lg:hidden')}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
