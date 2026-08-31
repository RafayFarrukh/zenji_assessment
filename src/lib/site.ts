export const site = {
  name: 'ZENJI',
  tagline: 'Anime streetwear from Melbourne',
  description:
    'ZENJI makes anime-inspired oversized streetwear in Melbourne. The Origin Drop: ten heavyweight pieces, limited stock, no restocks. Free shipping Australia-wide over A$150.',
  /**
   * Set NEXT_PUBLIC_SITE_URL in the Vercel project so canonical URLs, the
   * sitemap and OG tags point at the real deployment.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zenji-storefront.vercel.app',
  locale: 'en_AU',
} as const;

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();
