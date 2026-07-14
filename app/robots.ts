import type { MetadataRoute } from 'next';
import { business } from '@/lib/site-data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/cms', '/api/'],
    }],
    sitemap: `${business.url}/sitemap.xml`,
    host: business.url,
  };
}
