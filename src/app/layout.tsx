import type { Metadata, Viewport } from 'next';
import { Anton, Inter } from 'next/font/google';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Marquee } from '@/components/Marquee';
import { site } from '@/lib/site';
import './globals.css';

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

// Kanji come from the reader's own system stack — see --font-jp in
// globals.css. next/font can only serve Noto Sans JP's latin subset, which
// contains none of the glyphs we actually use, so self-hosting it would ship a
// webfont that renders nothing.

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'anime streetwear',
    'oversized tees',
    'Melbourne streetwear',
    'ZENJI',
    'limited drop',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
};

const organisationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  description: site.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Melbourne',
    addressRegion: 'VIC',
    addressCountry: 'AU',
  },
  sameAs: [
    'https://www.instagram.com/zenji_.shop',
    'https://www.tiktok.com/@zenji_.shop',
  ],
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font variables live on <html>: --font-display resolves them at :root,
    // and a custom property that fails to substitute there is invalid for the
    // whole inherited tree.
    <html lang="en-AU" className={`${anton.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="focus:bg-flame focus:text-bone sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Marquee />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
      </body>
    </html>
  );
}
