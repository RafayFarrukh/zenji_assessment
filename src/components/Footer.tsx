import Link from 'next/link';
import { NewsletterForm } from '@/components/NewsletterForm';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { href: '/drop', label: 'The Origin Drop' },
      { href: '/drop?filter=sale', label: 'On sale' },
      { href: '/drop?filter=in-stock', label: 'In stock' },
      { href: '/lookbook', label: 'Lookbook' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { href: '/our-story', label: 'Our story' },
      { href: '/faq', label: 'Shipping & returns' },
      { href: '/faq#sizing', label: 'Size guide' },
      { href: '/faq#contact', label: 'Contact' },
    ],
  },
] as const;

const SOCIAL = [
  { href: 'https://www.instagram.com/zenji_.shop', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@zenji_.shop', label: 'TikTok' },
  { href: 'https://www.facebook.com/people/ZENJI/61592433253702/', label: 'Facebook' },
] as const;

export function Footer() {
  return (
    <footer className="border-ink-line border-t">
      <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="font-display text-display-m uppercase">
            Get the next drop before it sells out
          </p>
          <p className="text-ash mt-3 max-w-[46ch] text-sm">
            One email per drop. Sizes, prices and the release time — nothing else.
          </p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:col-start-8">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="label text-ash">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-bone hover:text-flame text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3 lg:col-start-12 lg:justify-self-end">
          <h2 className="label text-ash">Follow</h2>
          <ul className="mt-4 space-y-3">
            {SOCIAL.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone hover:text-flame text-sm transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-ink-line border-t">
        <div className="shell text-ash flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            © {new Date().getFullYear()} ZENJI — Melbourne, Australia
          </p>
          <p className="label">
            <span className="font-jp text-bone">一期一会</span> — one meeting, one chance
          </p>
        </div>
      </div>
    </footer>
  );
}
