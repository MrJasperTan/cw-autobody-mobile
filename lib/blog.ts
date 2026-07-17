export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  image: string;
  imageAlt: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'mobile-dent-repair-or-body-shop',
    title: 'Mobile dent repair or body shop? How to choose',
    description: 'A practical guide for East Valley drivers deciding whether damage is a good fit for mobile repair or needs a collision facility.',
    category: 'Repair guide',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readTime: '5 min read',
    image: '/corvette-poster.webp',
    imageAlt: 'Red Corvette bodywork shown during a cosmetic repair sequence',
    sections: [
      {
        heading: 'Start with the type of damage—not the inconvenience',
        paragraphs: [
          'Mobile auto body repair is designed for cosmetic and limited body damage that can be repaired safely at a home, office, dealership, or fleet location. Door dings, shallow dents, bumper scuffs, paint scratches, curb rash, and localized finish damage are common reasons to request a mobile estimate.',
          'A traditional collision facility is the better starting point when damage may affect structural integrity, airbags, suspension, sensors, cooling components, or safe vehicle operation. The question is not whether the damage looks dramatic in one photo. It is whether the repair can be completed safely with mobile tools and controlled working conditions.',
        ],
        bullets: [
          'Usually worth a mobile estimate: door dings, bumper scrapes, shallow dents, scratches, paint chips, curb rash, and cloudy headlights.',
          'Usually needs a shop inspection: airbag deployment, fluid leaks, a wheel pushed out of position, doors that no longer close correctly, or visible structural distortion.',
          'Do not drive if steering, braking, lighting, visibility, or fluid retention may be affected.',
        ],
      },
      {
        heading: 'Good photos make the first decision faster',
        paragraphs: [
          'Send one wide photo showing the entire damaged panel, two medium-distance angles, and close-ups showing paint condition and the deepest point of the damage. Include the vehicle year, make, model, service ZIP code, and a short description of what happened.',
          'CW Mobile Autobody reviews the damage for mobile work first. If the photos suggest that a collision facility is more appropriate, referral guidance is more useful than forcing the wrong repair method.',
        ],
      },
      {
        heading: 'Consider the work location',
        paragraphs: [
          'A suitable mobile repair area needs room around the vehicle, permission to work, and conditions that allow the repair to stay clean and controlled. Covered parking can help during intense Arizona sun, but tight spaces are not suitable for every process.',
          'When requesting an estimate in Mesa, Chandler, Gilbert, Tempe, Phoenix, or a nearby East Valley community, mention whether the vehicle will be at a house, apartment, workplace, dealership, or fleet yard.',
        ],
      },
    ],
    faqs: [
      { question: 'Can every dent be repaired at my location?', answer: 'No. Access behind the panel, paint damage, panel material, dent depth, body lines, and structural concerns all affect whether mobile repair is appropriate.' },
      { question: 'Can you tell from one photo?', answer: 'Sometimes, but several angles are more reliable. A final scope may still require an in-person inspection before work begins.' },
    ],
  },
  {
    slug: 'bumper-repair-vs-replacement',
    title: 'Bumper repair vs. replacement: what actually matters',
    description: 'Learn which signs point toward plastic bumper repair, refinishing, part replacement, or a deeper collision inspection.',
    category: 'Bumper repair',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readTime: '6 min read',
    image: '/hero-poster.webp',
    imageAlt: 'CW Mobile Autobody service vehicle prepared for an on-site repair',
    sections: [
      {
        heading: 'The bumper cover is only the visible layer',
        paragraphs: [
          'What most drivers call the bumper is usually a painted plastic cover over impact-absorbing components and mounting hardware. A scuff may be cosmetic, while similar-looking damage after a harder impact can hide broken tabs, a distorted absorber, sensor problems, or damage behind the cover.',
          'Repair decisions should account for the plastic condition, mounting points, paint damage, nearby lights and sensors, and how the panel fits against the fender, trunk, hatch, or grille.',
        ],
      },
      {
        heading: 'When repair may make sense',
        paragraphs: [
          'Localized scrapes, paint transfer, shallow gouges, small deformations, and some limited cracks may be repairable when the cover remains secure and surrounding components are undamaged. Work can include reshaping, plastic repair, surface preparation, color matching, and refinishing.',
          'Repairing the existing cover can avoid unnecessary part replacement, but only when the finished repair will be stable and restore proper appearance and function.',
        ],
        bullets: [
          'The cover is secure and panel gaps remain consistent.',
          'Damage is localized rather than spread across multiple mounting areas.',
          'Parking sensors, lamps, cameras, and driver-assistance features work normally.',
          'There is no sign of damage deeper in the vehicle structure.',
        ],
      },
      {
        heading: 'When replacement or shop diagnosis is more likely',
        paragraphs: [
          'Replacement becomes more likely when mounting tabs are missing, plastic is badly torn or stretched, previous repairs have failed, or restoration approaches the cost of a suitable replacement. A shop diagnosis is important after a meaningful collision or whenever safety-related components may be involved.',
          'Photos of the full bumper, both corner gaps, the damage close up, and any warning lights give an estimator a much clearer starting point than one tight image.',
        ],
      },
    ],
    faqs: [
      { question: 'Does a cracked bumper always need replacement?', answer: 'Not always. Crack location, length, plastic condition, mounting damage, and nearby sensors determine whether a durable repair is reasonable.' },
      { question: 'Can paint transfer be removed without repainting?', answer: 'Sometimes. If the underlying finish is intact, careful cleaning and correction may be enough. Damage through the clear coat or color layer needs a different repair.' },
    ],
  },
  {
    slug: 'how-to-photograph-car-damage-for-estimate',
    title: 'How to photograph car damage for a faster estimate',
    description: 'Use this simple photo checklist to show dent depth, paint condition, panel location, and the surrounding vehicle clearly.',
    category: 'Estimate tips',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readTime: '4 min read',
    image: '/reference-apperson-restoration.jpg',
    imageAlt: 'Vehicle exterior shown from a wide angle for condition documentation',
    sections: [
      {
        heading: 'Take the first photo from farther away',
        paragraphs: [
          'Begin with the whole side, front, or rear of the vehicle. This establishes which panel is damaged and shows how it aligns with adjacent parts. A close-up alone makes scale, location, and access difficult to judge.',
          'Then move closer for two angled photos. Reflections across the panel help reveal dent shape and body-line distortion better than a straight-on image.',
        ],
      },
      {
        heading: 'Use this six-photo checklist',
        paragraphs: ['Clean loose dust without rubbing grit into the paint. Photograph the vehicle in open shade or even daylight, hold the phone steady, and avoid digital zoom.'],
        bullets: [
          'One wide photo showing the complete damaged side, front, or rear.',
          'One medium photo from each side of the damage.',
          'One close-up showing scratches, cracks, chips, or exposed material.',
          'One low-angle photo that catches reflections across a dent.',
          'One photo of the VIN label or vehicle details if the exact trim is uncertain.',
        ],
      },
      {
        heading: 'Add the details a photo cannot show',
        paragraphs: [
          'Include the year, make, model, service ZIP code, and whether warning lights appeared. Mention loose parts, unusual noises, fluid leaks, panels that do not open correctly, and sensors or cameras in the damaged area.',
          'Accurate photos save time and help determine whether mobile repair, part replacement, or a collision-facility inspection is the right next step.',
        ],
      },
    ],
    faqs: [
      { question: 'Should I photograph damage at night with flash?', answer: 'Daylight or bright, even lighting is usually better. Flash glare can hide scratches and flatten the shape of a dent.' },
      { question: 'How many photos can I upload?', answer: 'The CW Mobile Autobody estimate form accepts up to eight damage images, with a maximum of 8 MB per image.' },
    ],
  },
  {
    slug: 'arizona-sun-scratches-and-paint-damage',
    title: 'Arizona sun, scratches, and fading paint: what to do first',
    description: 'A straightforward guide to identifying surface marks, deeper scratches, clear-coat failure, and paint fading in Arizona.',
    category: 'Paint care',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readTime: '5 min read',
    image: '/reference-oldsmobile-restoration.jpg',
    imageAlt: 'Vehicle paint before and after exterior restoration work',
    sections: [
      {
        heading: 'Not every mark requires the same repair',
        paragraphs: [
          'Arizona heat and ultraviolet exposure are hard on automotive finishes, but sun is only one part of the problem. Abrasive dust, automatic car washes, bird droppings, tree sap, road debris, and delayed chip repair can all affect the clear coat and color layers.',
          'A mark that disappears when wet may be limited to the clear coat and could respond to paint correction. A scratch that catches a fingernail or exposes metal or plastic usually needs more than polishing.',
        ],
      },
      {
        heading: 'Look for these differences',
        paragraphs: ['Swirl marks appear as fine circular scratches under direct light. Oxidation looks dull. Clear-coat failure often appears cloudy, cracked, or peeling. Rock chips are small but can expose metal and allow corrosion to begin.'],
        bullets: [
          'Surface transfer: material from another object sits on top of the finish.',
          'Clear-coat scratch: visible in reflected light without exposing color.',
          'Deep scratch or chip: color, primer, metal, or plastic is exposed.',
          'Clear-coat failure: the upper finish is lifting, peeling, or breaking apart.',
        ],
      },
      {
        heading: 'Protect the area while deciding',
        paragraphs: [
          'Wash gently with automotive products, avoid aggressive household solvents, and do not sand or apply touch-up paint unless you understand the process. Improvised work can enlarge the final repair area.',
          'Covered parking, regular gentle washing, prompt contaminant removal, and suitable paint protection can reduce exposure. For an estimate, send daylight photos of both the damage and the full panel.',
        ],
      },
    ],
    faqs: [
      { question: 'Can faded paint be polished back to normal?', answer: 'Sometimes, if oxidation is limited and enough healthy clear coat remains. Peeling or failed clear coat generally cannot be restored by polishing alone.' },
      { question: 'Should I use rubbing compound on a scratch?', answer: 'Only with care and an understanding of paint thickness. Aggressive compound can create haze or remove too much clear coat, especially on edges.' },
    ],
  },
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}
