'use client';

import { useState } from 'react';
import { FaCheck, FaShareNodes } from 'react-icons/fa6';

export default function ShareSiteButton() {
  const [copied, setCopied] = useState(false);

  const shareSite = async () => {
    const shareData = {
      title: 'CW Mobile Autobody',
      text: 'Mobile dent, bumper, and paint repair with free photo estimates.',
      url: window.location.origin,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="footer-share-button" type="button" onClick={shareSite}>
      {copied ? <FaCheck aria-hidden="true" /> : <FaShareNodes aria-hidden="true" />}
      {copied ? 'Link copied' : 'Share website'}
    </button>
  );
}
