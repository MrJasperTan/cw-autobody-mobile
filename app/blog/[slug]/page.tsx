import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaCamera, FaClock, FaPhone } from 'react-icons/fa6';
import BlogHeader from '@/components/BlogHeader';
import { blogArticles, getBlogArticle } from '@/lib/blog';
import { getCmsContent } from '@/lib/cms-content';

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getBlogArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = getBlogArticle((await params).slug);
  if (!article) notFound();
  const { business } = await getCmsContent();
  const currentIndex = blogArticles.findIndex((item) => item.slug === article.slug);
  const nextArticle = blogArticles[(currentIndex + 1) % blogArticles.length];
  const articleUrl = `${business.url}/blog/${article.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.description,
        image: `${business.url}${article.image}`,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { '@type': 'Organization', name: business.name, url: business.url },
        publisher: {
          '@type': 'Organization',
          name: business.name,
          url: business.url,
          logo: { '@type': 'ImageObject', url: `${business.url}/cw-mark.svg` },
        },
        mainEntityOfPage: articleUrl,
        about: ['Auto body repair', 'Mobile auto body repair', article.category],
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: business.url },
          { '@type': 'ListItem', position: 2, name: 'Repair Guides', item: `${business.url}/blog` },
          { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };

  return (
    <main className="blog-shell article-shell">
      <BlogHeader business={business} backToBlog />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article>
        <header className="article-hero">
          <div className="article-hero-copy">
            <p className="blog-meta"><span>{article.category}</span><span><FaClock aria-hidden="true" /> {article.readTime}</span></p>
            <h1>{article.title}</h1>
            <p className="article-deck">{article.description}</p>
            <div className="article-byline">
              <Image src="/cw-mark.svg" alt="" width={42} height={42} />
              <span><strong>CW Mobile Autobody</strong>Repair guidance for East Valley drivers</span>
            </div>
          </div>
          <div className="article-hero-image">
            <Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 900px) 100vw, 48vw" priority />
          </div>
        </header>

        <div className="article-layout">
          <aside className="article-aside">
            <Link href="/blog"><FaArrowLeft aria-hidden="true" /> All repair guides</Link>
            <p>Published <time dateTime={article.publishedAt}>July 17, 2026</time></p>
            <a href={`tel:${business.sms}`}><FaPhone aria-hidden="true" /> Ask about damage</a>
          </aside>
          <div className="article-body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
            <section className="article-faq" aria-labelledby="article-faq-title">
              <p className="eyebrow dark">Quick answers</p>
              <h2 id="article-faq-title">Frequently asked questions</h2>
              {article.faqs.map((faq) => (
                <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
              ))}
            </section>
            <aside className="article-estimate">
              <FaCamera aria-hidden="true" />
              <div><h2>Want an answer about your vehicle?</h2><p>Upload clear photos for a free estimate and mobile-repair review.</p></div>
              <Link className="btn btn-primary" href="/#quote">Send photos <FaArrowRight aria-hidden="true" /></Link>
            </aside>
          </div>
        </div>
      </article>
      <section className="next-article">
        <p className="eyebrow dark">Read next</p>
        <Link href={`/blog/${nextArticle.slug}`}>
          <span>{nextArticle.category}</span><h2>{nextArticle.title}</h2><FaArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
