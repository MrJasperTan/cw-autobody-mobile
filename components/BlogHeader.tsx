import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaPhone } from 'react-icons/fa6';
import type { CmsContent } from '@/lib/cms-content';

type BlogHeaderProps = {
  business: CmsContent['business'];
  backToBlog?: boolean;
};

export default function BlogHeader({ business, backToBlog = false }: BlogHeaderProps) {
  return (
    <header className="blog-header" aria-label="Blog navigation">
      <Link className="brand-lockup" href="/" aria-label={`${business.name} home`}>
        <Image className="brand-mark" src="/cw-mark.svg" alt="" width={42} height={42} priority />
        <span>
          <span className="brand-name">{business.name.replace(/^CW\s+/i, '')}</span>
          <small>Mobile auto body repair</small>
        </span>
      </Link>
      <nav>
        <Link href={backToBlog ? '/blog' : '/'}>
          <FaArrowLeft aria-hidden="true" />
          {backToBlog ? 'All articles' : 'Main site'}
        </Link>
        <Link href="/#services">Services</Link>
        <Link href="/#quote">Free estimate</Link>
      </nav>
      <a className="header-call" href={`tel:${business.sms}`} aria-label={`Call ${business.name}`}>
        <FaPhone aria-hidden="true" />
        <span>{business.phone}</span>
      </a>
    </header>
  );
}
