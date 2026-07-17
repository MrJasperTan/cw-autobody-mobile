import type { MetadataRoute } from 'next';
import { business } from '@/lib/site-data';
import { getCmsContent } from '@/lib/cms-content';
import { blogArticles } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getCmsContent();

  const siteUrl = content.business.url || business.url;

  return [
    {
      url: siteUrl,
      lastModified: new Date(content.updatedAt),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date('2026-07-17'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogArticles.map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
