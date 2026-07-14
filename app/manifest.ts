import type { MetadataRoute } from 'next';
import { business, images } from '@/lib/site-data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name} - Mobile Autobody Repair`,
    short_name: business.name,
    description: business.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#101114',
    theme_color: business.brandColor,
    orientation: 'portrait-primary',
    categories: ['automotive', 'business'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      {
        src: images.hero,
        sizes: '1920x1080',
        type: 'image/jpeg',
        form_factor: 'wide',
      },
    ],
  };
}
