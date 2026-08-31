import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product photography ships as local .webp; keep AVIF off so build stays fast
    // and the source webp is served directly at the sizes we actually request.
    formats: ['image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 128, 192, 256, 384],
  },
  poweredByHeader: false,
};

export default nextConfig;
