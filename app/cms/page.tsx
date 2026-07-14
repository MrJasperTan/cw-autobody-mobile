import type { Metadata } from 'next';
import OwnerCms from '@/components/cms/OwnerCms';

export const metadata: Metadata = {
  title: { absolute: 'Owner CMS | CW Mobile Autobody' },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CmsPage() {
  return <OwnerCms />;
}
