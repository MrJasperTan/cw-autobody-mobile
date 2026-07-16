'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/next';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!measurementId) return;
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.gtag?.('event', 'page_view', {
      page_location: window.location.origin + pathname,
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    if (!measurementId) return;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href, window.location.href);
      let eventName = anchor.dataset.analyticsEvent || '';
      if (eventName && !/^[a-z][a-z0-9_]{1,39}$/.test(eventName)) eventName = '';
      if (!eventName && url.protocol === 'mailto:') eventName = 'email_click';
      if (!eventName && url.protocol === 'tel:') eventName = 'phone_click';
      if (!eventName && url.protocol === 'sms:') eventName = 'sms_click';
      if (!eventName && /^https?:$/.test(url.protocol) && url.origin !== window.location.origin) {
        eventName = 'outbound_click';
      }
      if (!eventName) return;
      window.gtag?.('event', eventName, {
        link_domain: url.hostname || undefined,
        link_path: /^https?:$/.test(url.protocol) ? url.pathname : undefined,
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!measurementId) return <Analytics />;

  return (
    <>
      <Analytics />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
