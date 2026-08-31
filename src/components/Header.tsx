'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [bumping, setBumping] = useState(false);

  const count = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const hydrated = useCartHydrated();
  const previousCount = useRef(count);

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

  // The badge springs when something lands in it — this is what the flying
  // product image is aimed at.
  useEffect(() => {
    if (count > previousCount.current) {
      setBumping(true);
      const id = setTimeout(() => setBumping(false), 460);
      previousCount.current = count;
      return () => clearTimeout(id);
    }
    previousCount.current = count;
  }, [count]);

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
                          'label group text-ash hover:text-bone relative block py-1 transition-colors',
                          active && 'text-bone',
                        )}
                      >
                        {link.label}
                        {/* The underline draws in from the left rather than
                            appearing all at once. */}
                        <span
                          aria-hidden
                          className={cn(
                            'bg-flame absolute -bottom-px left-0 h-px w-full origin-left',
                            'transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                          )}
                        />
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
              data-cart-target
              onClick={openCart}
              className={cn(iconButton, 'relative')}
              aria-label={
                hydrated && count > 0
                  ? `Open cart, ${count} item${count === 1 ? '' : 's'}`
                  : 'Open cart'
              }
            >
              <BagIcon className={cn('h-5 w-5', bumping && 'bump-once')} />
              {hydrated && count > 0 && (
                <span
                  className={cn(
                    'bg-flame font-display text-bone absolute top-1 right-0.5 min-w-[18px] px-1 py-0.5 text-center text-[11px] leading-none',
                    bumping && 'bump-once',
                  )}
                >
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
