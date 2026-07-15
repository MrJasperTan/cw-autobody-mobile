import {
  business,
  beforeAfterProjects,
  faqs,
  hours,
  images,
  insuranceFeatures,
  navItems,
  processSteps,
  proof,
  reviews,
  services,
} from './site-data';
import { ensureSchema } from './turso';

export type CmsContent = {
  business: typeof business;
  beforeAfterProjects: typeof beforeAfterProjects;
  navItems: typeof navItems;
  images: typeof images;
  proof: typeof proof;
  services: typeof services;
  processSteps: typeof processSteps;
  insuranceFeatures: typeof insuranceFeatures;
  reviews: typeof reviews;
  faqs: typeof faqs;
  hours: typeof hours;
  updatedAt: string;
};

export const defaultCmsContent: CmsContent = {
  business,
  beforeAfterProjects,
  navItems,
  images,
  proof,
  services,
  processSteps,
  insuranceFeatures,
  reviews,
  faqs,
  hours,
  updatedAt: new Date(0).toISOString(),
};

const CMS_KEY = 'site-content-v2';

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

const text = (value: unknown, fallback = '', maxLength = 500) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value.trim().slice(0, maxLength);
};

const number = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const arrayOfRecords = <T,>(
  value: unknown,
  fallback: T[],
  mapper: (record: Record<string, unknown>, fallbackItem: T, index: number) => T,
  limit = 24,
) => {
  const source = Array.isArray(value) ? value : fallback;

  return source.slice(0, limit).map((item, index) => {
    const fallbackItem = fallback[index] || fallback[0];
    return mapper(asRecord(item), fallbackItem, index);
  });
};

export const sanitizeCmsContent = (input: unknown): CmsContent => {
  const record = asRecord(input);
  const rawBusiness = asRecord(record.business);
  const rawImages = asRecord(record.images);

  return {
    business: {
      ...business,
      name: text(rawBusiness.name, business.name, 80),
      legalName: text(rawBusiness.legalName, business.legalName, 120),
      tagline: text(rawBusiness.tagline, business.tagline, 180),
      description: text(rawBusiness.description, business.description, 500),
      url: text(rawBusiness.url, business.url, 240),
      phone: text(rawBusiness.phone, business.phone, 40),
      sms: text(rawBusiness.sms, business.sms, 40),
      email: text(rawBusiness.email, business.email, 120),
      address: text(rawBusiness.address, business.address, 160),
      city: text(rawBusiness.city, business.city, 80),
      state: text(rawBusiness.state, business.state, 40),
      zip: text(rawBusiness.zip, business.zip, 20),
      latitude: number(rawBusiness.latitude, business.latitude),
      longitude: number(rawBusiness.longitude, business.longitude),
      serviceArea: text(rawBusiness.serviceArea, business.serviceArea, 220),
      priceRange: text(rawBusiness.priceRange, business.priceRange, 8),
      founded: text(rawBusiness.founded, business.founded, 12),
      brandColor: text(rawBusiness.brandColor, business.brandColor, 20),
      quoteUrl: text(rawBusiness.quoteUrl, business.quoteUrl, 240),
      bookingUrl: text(rawBusiness.bookingUrl, business.bookingUrl, 240),
      mapUrl: text(rawBusiness.mapUrl, business.mapUrl, 500),
    },
    beforeAfterProjects: arrayOfRecords(
      record.beforeAfterProjects,
      beforeAfterProjects,
      (item, fallback, index) => {
        const id = text(item.id, fallback?.id || `repair-${index + 1}`, 80);
        const isReference = id.startsWith('reference-');

        return {
          id,
          title: text(item.title, fallback?.title || '', 120),
          service: text(item.service, fallback?.service || '', 100),
          description: text(item.description, fallback?.description || '', 360),
          beforeImage: text(item.beforeImage, fallback?.beforeImage || '', 500),
          beforeAlt: text(item.beforeAlt, fallback?.beforeAlt || '', 180),
          afterImage: text(item.afterImage, fallback?.afterImage || '', 500),
          afterAlt: text(item.afterAlt, fallback?.afterAlt || '', 180),
          rating: Math.min(5, Math.max(1, Math.round(number(item.rating, fallback?.rating || 5)))),
          customerName: text(item.customerName, fallback?.customerName || '', 100),
          customerReview: text(item.customerReview, fallback?.customerReview || '', 600),
          beforeScale: isReference ? number(item.beforeScale, fallback?.beforeScale || 1) : 1,
          beforePosition: isReference ? text(item.beforePosition, fallback?.beforePosition || 'center', 40) : 'center',
          afterScale: isReference ? number(item.afterScale, fallback?.afterScale || 1) : 1,
          afterPosition: isReference ? text(item.afterPosition, fallback?.afterPosition || 'center', 40) : 'center',
          isReference,
          sourceLabel: isReference ? text(item.sourceLabel, fallback?.sourceLabel || '', 180) : '',
          sourceUrl: isReference ? text(item.sourceUrl, fallback?.sourceUrl || '', 500) : '',
        };
      },
      16,
    ).filter((project) => project.title && project.beforeImage && project.afterImage),
    navItems,
    images: {
      hero: text(rawImages.hero, images.hero, 500),
      repair: text(rawImages.repair, images.repair, 500),
      detail: text(rawImages.detail, images.detail, 500),
      shop: text(rawImages.shop, images.shop, 500),
    },
    proof: (Array.isArray(record.proof) ? record.proof : proof)
      .slice(0, 8)
      .map((item, index) => text(item, proof[index] || 'Proof point', 120)),
    services: arrayOfRecords(record.services, services, (item, fallback) => {
      const savedPrice = text(item.price, fallback.price, 80);

      return {
        name: text(item.name, fallback.name, 120),
        description: text(item.description, fallback.description, 360),
        price: /^free estimates?$/i.test(savedPrice) ? fallback.price : savedPrice,
      };
    }, 12),
    processSteps: arrayOfRecords(record.processSteps, processSteps, (item, fallback) => ({
      title: text(item.title, fallback.title, 120),
      text: text(item.text, fallback.text, 360),
    }), 8),
    insuranceFeatures: (Array.isArray(record.insuranceFeatures) ? record.insuranceFeatures : insuranceFeatures)
      .slice(0, 12)
      .map((item, index) => text(item, insuranceFeatures[index] || 'Feature', 140)),
    reviews: arrayOfRecords(record.reviews, reviews, (item, fallback) => ({
      name: text(item.name, fallback.name, 100),
      location: text(item.location, fallback.location, 120),
      quote: text(item.quote, fallback.quote, 420),
    }), 12),
    faqs: arrayOfRecords(record.faqs, faqs, (item, fallback) => ({
      question: text(item.question, fallback.question, 180),
      answer: text(item.answer, fallback.answer, 600),
    }), 20),
    hours,
    updatedAt: text(record.updatedAt, defaultCmsContent.updatedAt, 40),
  };
};

export const getCmsContent = async () => {
  const db = await ensureSchema();

  if (!db) {
    return defaultCmsContent;
  }

  const row = await db.execute({
    sql: 'SELECT value FROM cms_content WHERE key = ? LIMIT 1',
    args: [CMS_KEY],
  });

  const value = row.rows[0]?.value;

  if (typeof value !== 'string') {
    return defaultCmsContent;
  }

  try {
    return sanitizeCmsContent(JSON.parse(value));
  } catch {
    return defaultCmsContent;
  }
};

export const saveCmsContent = async (input: unknown) => {
  const db = await ensureSchema();

  if (!db) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required for CMS saves.');
  }

  const rawProjects = asRecord(input).beforeAfterProjects;

  if (Array.isArray(rawProjects)) {
    const hasIncompletePair = rawProjects.some((project) => {
      const item = asRecord(project);
      return !text(item.title) || !text(item.beforeImage) || !text(item.afterImage);
    });

    if (hasIncompletePair) {
      throw new Error('Every before-and-after project requires a title, a Before image, and an After image.');
    }
  }

  const content = {
    ...sanitizeCmsContent(input),
    updatedAt: new Date().toISOString(),
  };

  await db.execute({
    sql: `INSERT INTO cms_content (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    args: [CMS_KEY, JSON.stringify(content)],
  });

  return content;
};
