import type { Metadata } from 'next';
import './globals.css';
import './blog.css';
import { generateSiteMetadata, generateStructuredData } from '@/lib/metadata';
import { getCmsContent } from '@/lib/cms-content';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata(await getCmsContent());
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getCmsContent();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content={content.business.brandColor} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(content)) }}
        />
      </head>
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
