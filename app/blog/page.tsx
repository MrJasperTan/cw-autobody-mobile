import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaCamera, FaClock, FaPhone } from 'react-icons/fa6';
import BlogHeader from '@/components/BlogHeader';
import { blogArticles } from '@/lib/blog';
import { getCmsContent } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Auto Body Repair Guides',
  description: 'Practical dent, bumper, paint, and mobile auto body repair guides for drivers in Mesa, Chandler, Gilbert, Tempe, Phoenix, and the East Valley.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Auto Body Repair Guides | CW Mobile Autobody',
    description: 'Straightforward answers about dents, bumper damage, paint repair, photo estimates, and choosing the right repair option.',
    images: ['/cw-mobile-autobody-og.jpg'],
  },
};

export default async function BlogPage() {
  const { business } = await getCmsContent();
  const [featured, ...articles] = blogArticles;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CW Mobile Autobody Repair Guides',
    url: `${business.url}/blog`,
    description: metadata.description,
    isPartOf: { '@id': `${business.url}/#website` },
    hasPart: blogArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      url: `${business.url}/blog/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
    })),
  };

  return (
    <main className="blog-shell">
      <BlogHeader business={business} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="blog-hero">
        <div className="blog-hero-image">
          <Image src={featured.image} alt={featured.imageAlt} fill sizes="100vw" priority />
          <div className="blog-image-shade" />
        </div>
        <div className="blog-hero-copy">
          <p className="eyebrow">CW repair journal</p>
          <h1>Know what your vehicle needs before you book.</h1>
          <p>Clear, local guidance about cosmetic damage, mobile repairs, and getting a useful photo estimate.</p>
        </div>
      </section>

      <nav className="blog-topics" aria-label="Article topics">
        <span>Explore</span>
        {Array.from(new Set(blogArticles.map((article) => article.category))).map((category) => (
          <a key={category} href={`#${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</a>
        ))}
      </nav>

      <section className="featured-article" id={featured.category.toLowerCase().replaceAll(' ', '-')}>
        <div className="featured-copy">
          <p className="blog-meta"><span>{featured.category}</span><span><FaClock aria-hidden="true" /> {featured.readTime}</span></p>
          <h2>{featured.title}</h2>
          <p>{featured.description}</p>
          <Link className="article-link" href={`/blog/${featured.slug}`}>Read the guide <FaArrowRight aria-hidden="true" /></Link>
        </div>
        <Link className="featured-visual" href={`/blog/${featured.slug}`} aria-label={`Read ${featured.title}`}>
          <Image src={featured.image} alt={featured.imageAlt} fill sizes="(max-width: 900px) 100vw, 48vw" />
        </Link>
      </section>

      <section className="article-index" aria-labelledby="latest-guides">
        <div className="article-index-heading">
          <p className="eyebrow dark">From the repair journal</p>
          <h2 id="latest-guides">Useful answers for East Valley drivers.</h2>
        </div>
        <div className="article-list">
          {articles.map((article, index) => (
            <article key={article.slug} className="article-row" id={article.category.toLowerCase().replaceAll(' ', '-')}>
              <span className="article-number">{String(index + 2).padStart(2, '0')}</span>
              <Link className="article-thumb" href={`/blog/${article.slug}`} tabIndex={-1}>
                <Image src={article.image} alt="" fill sizes="(max-width: 680px) 38vw, 220px" />
              </Link>
              <div>
                <p className="blog-meta"><span>{article.category}</span><span>{article.readTime}</span></p>
                <h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3>
                <p>{article.description}</p>
              </div>
              <Link className="article-arrow" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}><FaArrowRight aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="blog-cta">
        <div>
          <p className="eyebrow">Have damage now?</p>
          <h2>Send photos. Get a free estimate.</h2>
          <p>Include the vehicle, damaged panel, and two close angles. We will review whether mobile repair is a fit.</p>
        </div>
        <div className="blog-cta-actions">
          <Link className="btn btn-primary" href="/#quote"><FaCamera aria-hidden="true" /> Start photo estimate</Link>
          <a className="btn btn-secondary" href={`tel:${business.sms}`}><FaPhone aria-hidden="true" /> {business.phone}</a>
        </div>
      </section>
    </main>
  );
}
