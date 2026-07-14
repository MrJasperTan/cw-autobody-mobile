import type { MetadataRoute } from 'next';
import { business } from '@/lib/site-data';
import { getCmsContent } from '@/lib/cms-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getCmsContent();

  return [
    {
      url: content.business.url || business.url,
      lastModified: new Date(content.updatedAt),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
