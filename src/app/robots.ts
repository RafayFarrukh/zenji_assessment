import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing useful to index, and they hold order details.
      disallow: ['/cart', '/checkout'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
