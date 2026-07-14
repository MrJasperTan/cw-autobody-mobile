export const business = {
  name: 'CW Mobile Autobody',
  legalName: 'CW Mobile Autobody',
  tagline: 'Mobile body, bumper, paint, wheel, and cosmetic repair with free photo estimates.',
  description:
    'CW Mobile Autobody provides on-site auto body repair across Chandler, Mesa, Gilbert, Tempe, and Phoenix. Publicly listed services include dent and frame repair, plastic bumper repair, scratch and scrape repair, headlight restoration and tinting, wheel curb-rash repair and painting, touch-up and color matching, part replacement, paint correction, and paint restoration.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://autobody.thejaspertan.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '480-300-9022',
  sms: process.env.NEXT_PUBLIC_SMS || '+14803009022',
  email: process.env.NEXT_PUBLIC_EMAIL || 'quotes@autobody.thejaspertan.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Mobile service by appointment',
  city: process.env.NEXT_PUBLIC_CITY || 'Mesa',
  state: process.env.NEXT_PUBLIC_STATE || 'AZ',
  zip: process.env.NEXT_PUBLIC_ZIP || '85201',
  latitude: Number(process.env.NEXT_PUBLIC_LATITUDE || '33.4152'),
  longitude: Number(process.env.NEXT_PUBLIC_LONGITUDE || '-111.8315'),
  serviceArea: 'Chandler, Mesa, Gilbert, Tempe, Phoenix, and nearby East Valley communities',
  priceRange: '$$',
  founded: '',
  brandColor: '#e7352c',
  quoteUrl: process.env.NEXT_PUBLIC_QUOTE_URL || '#quote',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || '#quote',
  mapUrl:
    process.env.NEXT_PUBLIC_MAP_URL ||
    'https://maps.google.com/?q=CW%20Autobody%20Mobile%20Chandler%20AZ',
};

export const hours = [
  { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
  { dayOfWeek: 'Saturday', opens: '09:00', closes: '15:00' },
];

export const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Results', href: '#results' },
  { label: 'Process', href: '#process' },
  { label: 'Estimates', href: '#estimates' },
  { label: 'Service terms', href: '#reviews' },
  { label: 'Quote', href: '#quote' },
];

export type BeforeAfterProject = {
  id: string;
  title: string;
  service: string;
  description: string;
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
  rating?: number;
  customerName?: string;
  customerReview?: string;
  beforeScale?: number;
  beforePosition?: string;
  afterScale?: number;
  afterPosition?: string;
  isReference?: boolean;
  sourceLabel?: string;
  sourceUrl?: string;
};

// Temporary CC0 restoration references. Owner-published CMS pairs replace these
// without representing another repairer's portfolio as CW customer work.
export const beforeAfterProjects: BeforeAfterProject[] = [
  {
    id: 'reference-jaguar-bodywork',
    title: 'Bodywork to finished paint',
    service: 'Temporary restoration reference',
    description: 'A clear example of metal preparation followed by finished paint and trim. Replace this reference with verified CW work from the owner CMS.',
    beforeImage: '/reference-jaguar-restoration.jpg',
    beforeAlt: 'Classic Jaguar with unfinished bodywork before paint and trim',
    afterImage: '/reference-jaguar-restoration.jpg',
    afterAlt: 'Classic Jaguar with completed paint, lights, grille, and trim',
    beforeScale: 2,
    beforePosition: 'right center',
    afterScale: 2,
    afterPosition: 'left center',
    isReference: true,
    sourceLabel: 'Dietmar Becker / Wikimedia Commons, CC0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:BodyworkPaintjob(before-after).jpg',
  },
  {
    id: 'reference-oldsmobile-restoration',
    title: 'Oldsmobile exterior restoration',
    service: 'Temporary restoration reference',
    description: 'A public-domain example showing a weathered vehicle before restoration and the completed exterior afterward.',
    beforeImage: '/reference-oldsmobile-restoration.jpg',
    beforeAlt: 'Weathered Oldsmobile Cutlass before exterior restoration',
    afterImage: '/reference-oldsmobile-restoration.jpg',
    afterAlt: 'Red Oldsmobile Cutlass after exterior restoration',
    beforeScale: 2.15,
    beforePosition: 'left bottom',
    afterScale: 1.45,
    afterPosition: 'right top',
    isReference: true,
    sourceLabel: 'Marty Wilke / Wikimedia Commons, CC0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:BeforeAndAfterAutomobileRestoration.jpg',
  },
  {
    id: 'reference-apperson-restoration',
    title: 'Apperson roadster restoration',
    service: 'Temporary restoration reference',
    description: 'A public-domain comparison of an unrestored roadster and its completed exterior restoration.',
    beforeImage: '/reference-apperson-restoration.jpg',
    beforeAlt: 'Rusty Apperson roadster before restoration',
    afterImage: '/reference-apperson-restoration.jpg',
    afterAlt: 'Red Apperson roadster after restoration',
    beforeScale: 2.2,
    beforePosition: 'left bottom',
    afterScale: 1.35,
    afterPosition: 'right top',
    isReference: true,
    sourceLabel: 'Lloyd Apperson / Wikimedia Commons, public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Apperson_Chummy_Restored_By_Louie_Floyd_Apperson.jpg',
  },
];

export const images = {
  hero:
    'https://pub-e15f0231bba24d79b9010e79bb64221c.r2.dev/cms/uploads/mobile-dent-repair-service-vehicle.webp',
  repair:
    'https://pub-e15f0231bba24d79b9010e79bb64221c.r2.dev/cms/uploads/mobile-dent-repair-service-vehicle.webp',
  detail:
    'https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?auto=format&fit=crop&w=1800&q=85',
  shop:
    'https://images.unsplash.com/photo-1632823471565-1ecdf5c7d370?auto=format&fit=crop&w=1800&q=85',
};

export const proof = [
  'Free photo estimates',
  'No deposit required',
  'Same-day service offered',
  'All work done on site',
];

export const appointmentWindows = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export const estimateTypes = [
  'Dent repair',
  'Frame repair',
  'Plastic bumper repair',
  'Scratch and scrape repair',
  'Paint touch-up or color matching',
  'Headlight restoration or tinting',
  'Wheel curb-rash repair or painting',
  'Paint correction or restoration',
  'Part replacement',
  'Multiple repairs',
  'Not sure yet',
];

export const services = [
  {
    name: 'Dent repair',
    description: 'Mobile dent repair for door dings, parking lot damage, shallow dents, and everyday body damage.',
    price: 'Free estimate',
  },
  {
    name: 'Frame repair',
    description: 'Frame repair evaluation and repair guidance for visible alignment or impact-related damage.',
    price: 'Free estimate',
  },
  {
    name: 'Plastic bumper repair',
    description: 'Mobile repair for plastic bumper scrapes, gouges, scuffs, cracks, and minor impact damage.',
    price: 'Free estimate',
  },
  {
    name: 'Scratch, scrape, and paint repair',
    description: 'On-site scratch and scrape repair, touch-up painting, color matching, paint correction, and paint restoration.',
    price: 'Free estimate',
  },
  {
    name: 'Headlight restoration and tinting',
    description: 'Headlight surface restoration and custom headlight tinting offered as part of the mobile service catalog.',
    price: 'Free estimate',
  },
  {
    name: 'Wheel curb-rash repair and painting',
    description: 'Cosmetic wheel repair for curb rash, scuffs, finish damage, and wheel repainting.',
    price: 'Free estimate',
  },
  {
    name: 'Part replacement and custom repairs',
    description: 'New-part replacement and custom cosmetic repair work evaluated from photos before scheduling.',
    price: 'Free estimate',
  },
];

export const processSteps = [
  {
    title: 'Send photos',
    text: 'Upload clear damage photos or message 480-300-9022. CW Mobile Autobody advertises free estimates with photo review available around the clock.',
  },
  {
    title: 'Review the estimate',
    text: 'Receive the repair scope and estimate before work begins. No deposit is required.',
  },
  {
    title: 'Schedule mobile service',
    text: 'Choose a suitable vehicle location and appointment window. Same-day service is offered when availability allows.',
  },
  {
    title: 'Inspect and pay',
    text: 'Review the completed work on site. Listed payment options include Cash App, Zelle, and credit-card tap-to-pay.',
  },
];

export const insuranceFeatures = [
  'Free damage estimate from photos or phone',
  'No deposit required before work begins',
  'Same-day mobile service offered when available',
  'Cash App, Zelle, and credit-card tap-to-pay accepted',
];

export const reviews = [
  {
    name: 'Estimate policy',
    location: 'Photo or text',
    quote: 'Send photos of the damage for a free estimate. The public service listing states that estimates are available within 24 hours and may arrive in minutes.',
  },
  {
    name: 'Booking policy',
    location: 'Mobile appointment',
    quote: 'No deposit is required. Same-day service is offered when the repair scope, location, and schedule allow it.',
  },
  {
    name: 'Payment options',
    location: 'On-site checkout',
    quote: 'Listed payment methods include Cash App, Zelle, and credit-card tap-to-pay after the completed repair is reviewed.',
  },
];

export const faqs = [
  {
    question: 'What services are offered on site?',
    answer:
      'The current service listing includes dent and frame repair, plastic bumper repair, scratches and scrapes, headlight restoration and tinting, wheel curb-rash repair and painting, touch-up and color matching, part replacement, paint correction, and paint restoration.',
  },
  {
    question: 'Are estimates free?',
    answer:
      'Yes. Free estimates are listed on the service vehicle and in the current public ad. Call or text 480-300-9022, or upload photos through the estimate form.',
  },
  {
    question: 'Is a deposit required?',
    answer:
      'The current CW Mobile Autobody public listing says no deposit is required. Confirm the final scope, price, and payment timing with the technician before work starts.',
  },
  {
    question: 'Is same-day service available?',
    answer:
      'Same-day service is offered and depends on the repair, travel distance, weather, materials, and appointment availability. Send photos early for the fastest scheduling answer.',
  },
  {
    question: 'How can I pay?',
    answer:
      'The public service listing names Cash App, Zelle, and credit-card tap-to-pay as accepted payment methods.',
  },
];

export const seoKeywords = [
  'mobile autobody repair',
  'CW Mobile Autobody',
  'CW Mobile Autobody Chandler',
  'mobile auto body repair near me',
  'mobile dent repair',
  'mobile dent repair Mesa',
  'mobile dent repair Chandler',
  'mobile dent repair Gilbert',
  'bumper repair Mesa',
  'plastic bumper repair Arizona',
  'scratch repair near me',
  'scratch and scrape repair',
  'frame repair Arizona',
  'free dent repair estimate',
  'wheel curb rash repair Chandler',
  'headlight restoration Chandler',
  'mobile paint correction Phoenix',
  '480-300-9022',
];
