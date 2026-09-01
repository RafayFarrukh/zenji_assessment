import type { NextConfig } from 'next';

/** One year. The product photography is fixed for the drop and the filenames never change. */
const ONE_YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  images: {
    // Product photography ships as local .webp; keep AVIF off so build stays fast
    // and the source webp is served directly at the sizes we actually request.
    formats: ['image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 128, 192, 256, 384],
    // How long the CDN keeps an optimised variant before regenerating it.
    minimumCacheTTL: ONE_YEAR,
  },
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Static files under /public are served with `max-age=0,
        // must-revalidate` by default, and next/image copies that upstream
        // header onto the optimised output — so every page view re-requested
        // all 28 product images instead of reading them from the browser
        // cache. These filenames are stable and their contents never change,
        // so they are safe to treat as immutable.
        source: '/products/:path*',
        headers: [
          { key: 'Cache-Control', value: `public, max-age=${ONE_YEAR}, immutable` },
        ],
      },
    ];
  },
};

export default nextConfig;
