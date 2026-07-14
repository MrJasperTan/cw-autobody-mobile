import type { Metadata } from 'next';
import type { CmsContent } from './cms-content';
import {
  beforeAfterProjects,
  business,
  images,
  insuranceFeatures,
  seoKeywords,
  services,
} from './site-data';

type SeoContent = Pick<
  CmsContent,
  'business' | 'images' | 'services' | 'insuranceFeatures' | 'beforeAfterProjects'
>;

const defaultSeoContent: SeoContent = {
  business,
  images,
  services,
  insuranceFeatures,
  beforeAfterProjects,
};

export function generateSiteMetadata(content: SeoContent = defaultSeoContent): Metadata {
  const siteBusiness = content.business;
  const title = `${siteBusiness.name} | Dent, Bumper & Paint Repair`;
  const seoDescription = 'Mobile dent, bumper, scratch, and paint repair across Mesa, Chandler, and the East Valley. Send photos to CW Mobile Autobody for a free estimate.';
  const socialImage = '/cw-mobile-autobody-og.jpg';

  return {
    title: {
      default: title,
      template: `%s | ${siteBusiness.name}`,
    },
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: siteBusiness.name }],
    creator: siteBusiness.name,
    publisher: siteBusiness.name,
    metadataBase: new URL(siteBusiness.url),
    alternates: { canonical: '/' },
    applicationName: siteBusiness.name,
    category: 'automotive',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteBusiness.url,
      title,
      description: seoDescription,
      siteName: siteBusiness.name,
      images: [{
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${siteBusiness.name} mobile dent, bumper, and paint repair in the East Valley`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: seoDescription,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStructuredData(content: SeoContent = defaultSeoContent) {
  const siteBusiness = content.business;
  const shopId = `${siteBusiness.url}/#business`;
  const graph: Record<string, unknown>[] = [{
    '@type': ['AutoBodyShop', 'LocalBusiness'],
    '@id': shopId,
    name: siteBusiness.name,
    legalName: siteBusiness.legalName,
    description: siteBusiness.description,
    image: content.images.hero,
    logo: `${siteBusiness.url}/cw-mark.svg`,
    url: siteBusiness.url,
    telephone: siteBusiness.phone,
    email: siteBusiness.email,
    priceRange: siteBusiness.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteBusiness.city,
      addressRegion: siteBusiness.state,
      postalCode: siteBusiness.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteBusiness.latitude,
      longitude: siteBusiness.longitude,
    },
    areaServed: siteBusiness.serviceArea.split(',').map((area) => ({
      '@type': 'City',
      name: area.trim(),
    })),
    hasMap: siteBusiness.mapUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '15:00',
      },
    ],
    makesOffer: content.services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: { '@id': shopId },
        areaServed: siteBusiness.serviceArea,
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        description: service.price,
      },
    })),
    amenityFeature: content.insuranceFeatures.map((feature) => ({
      '@type': 'LocationFeatureSpecification',
      name: feature,
      value: true,
    })),
  }, {
    '@type': 'WebSite',
    '@id': `${siteBusiness.url}/#website`,
    url: siteBusiness.url,
    name: siteBusiness.name,
    publisher: { '@id': shopId },
    inLanguage: 'en-US',
  }];

  const verifiedProjects = content.beforeAfterProjects.filter((project) => !project.isReference);

  if (verifiedProjects.length) {
    graph.push({
      '@type': 'ImageGallery',
      '@id': `${siteBusiness.url}/#results`,
      name: `${siteBusiness.name} before and after repairs`,
      about: { '@id': shopId },
      associatedMedia: verifiedProjects.flatMap((project) => [
        {
          '@type': 'ImageObject',
          name: `${project.title} before repair`,
          caption: project.beforeAlt || `${project.title} before repair`,
          contentUrl: project.beforeImage,
        },
        {
          '@type': 'ImageObject',
          name: `${project.title} after repair`,
          caption: project.afterAlt || `${project.title} after repair`,
          contentUrl: project.afterImage,
        },
      ]),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
