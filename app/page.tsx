import {
  FaCalendarCheck,
  FaCamera,
  FaCarBurst,
  FaChevronRight,
  FaClock,
  FaEnvelope,
  FaFileInvoiceDollar,
  FaLocationDot,
  FaLock,
  FaPhone,
  FaShieldHalved,
  FaTruckFast,
  FaWandMagicSparkles,
} from 'react-icons/fa6';
import Image from 'next/image';
import {
  appointmentWindows,
  estimateTypes,
} from '@/lib/site-data';
import { getCmsContent } from '@/lib/cms-content';
import HeroScroll from '@/components/HeroScroll';
import BeforeAfterCarousel from '@/components/BeforeAfterCarousel';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams: Promise<{
    estimate?: string;
    photos?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const submission = await searchParams;
  const {
    business,
    beforeAfterProjects,
    faqs,
    images,
    insuranceFeatures,
    navItems,
    processSteps,
    proof,
    reviews,
    services,
  } = await getCmsContent();

  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand-lockup" href="#top" aria-label={`${business.name} home`}>
          <Image className="brand-mark" src="/cw-mark.svg" alt="" width={42} height={42} priority />
          <span>
            <strong>{business.name.replace(/^CW\s+/i, '')}</strong>
            <small>Mobile auto body repair</small>
          </span>
        </a>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-call" href={`tel:${business.sms}`} aria-label={`Call ${business.name}`}>
          <FaPhone aria-hidden="true" />
          <span>{business.phone}</span>
        </a>
      </header>

      <HeroScroll
        businessName={business.name}
        frameBase="/corvette-frames"
        phone={business.phone}
        poster="/corvette-poster.webp"
        proof={proof}
        quoteUrl={business.quoteUrl}
        sms={business.sms}
        tagline={business.tagline}
      />

      <section className="intro-section" aria-label="Service summary">
        <div className="intro-copy">
          <p className="eyebrow dark">Built for busy drivers</p>
          <h2>Mobile dent, frame, bumper, scratch, and scrape repair with free estimates.</h2>
        </div>
        <div className="intro-detail">
          <p>
            {business.description} Every estimate is scoped for mobile work first, with clear referral guidance when
            a traditional collision facility is the better answer.
          </p>
          <a href="#quote">
            Start an estimate <FaChevronRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <BeforeAfterCarousel projects={beforeAfterProjects} />

      <section id="services" className="services-section">
        <div className="section-heading">
          <p className="eyebrow dark">Services</p>
          <h2>On-site body, paint, bumper, wheel, and restoration work built around mobile convenience.</h2>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article key={service.name} className="service-row">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <strong>{service.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-image" style={{ backgroundImage: `url(${images.repair})` }} />
        <div className="feature-content">
          <p className="eyebrow dark">On-site repair setup</p>
          <h2>Clean work areas, controlled lighting, pro materials, and a finish you can inspect before we leave.</h2>
          <ul>
            <li>
              <FaWandMagicSparkles aria-hidden="true" /> Paint-safe dent tooling and finish correction
            </li>
            <li>
              <FaShieldHalved aria-hidden="true" /> Protected surfaces, masking, dust control, and warranty notes
            </li>
            <li>
              <FaTruckFast aria-hidden="true" /> Home, office, fleet yard, dealership, and lease-return visits
            </li>
          </ul>
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="section-heading sticky-heading">
          <p className="eyebrow dark">Process</p>
          <h2>From photo quote to finished panel in four clear steps.</h2>
        </div>
        <div className="timeline">
          {processSteps.map((step, index) => (
            <article key={step.title} className="timeline-step">
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="estimates" className="insurance-section" style={{ backgroundImage: `url(${images.detail})` }}>
        <div>
          <p className="eyebrow">Free estimates</p>
          <h2>Call {business.phone} or send photos before scheduling mobile repair.</h2>
          <p>
            The service vehicle lists dent, frame, plastic bumper, scratch, and scrape repair. CW Mobile Autobody&apos;s current
            public listing also offers paint work, color matching, headlight restoration and tinting, wheel curb-rash
            repair, replacement parts, paint correction, and paint restoration.
          </p>
        </div>
        <ul>
          {insuranceFeatures.map((feature) => (
            <li key={feature}>
              <FaFileInvoiceDollar aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section id="reviews" className="reviews-section">
        <div className="section-heading">
          <p className="eyebrow dark">Service terms</p>
          <h2>Clear terms before work starts, with mobile payment options when the repair is complete.</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <figure key={review.name}>
              <blockquote>{review.quote}</blockquote>
              <figcaption>
                <strong>{review.name}</strong>
                <span>{review.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="local-section">
        <div>
          <p className="eyebrow dark">Local service area</p>
          <h2>{business.serviceArea}</h2>
          <p>
            Send photos from anywhere in the listed service area. Mobile work is scheduled at a home, office, fleet
            yard, dealership, or another suitable vehicle location.
          </p>
        </div>
        <div className="hours-panel">
          <FaClock aria-hidden="true" />
          <h3>Estimate availability</h3>
          <p>
            <strong>Text or photos</strong>
            <span>Message anytime</span>
          </p>
          <p>
            <strong>Mobile repair</strong>
            <span>By appointment</span>
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading">
          <p className="eyebrow dark">FAQ</p>
          <h2>Questions drivers ask before booking.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="quote" className="quote-section">
        <div className="quote-media">
          <video autoPlay muted loop playsInline poster="/hero-poster.webp" aria-hidden="true">
            <source src="/mobile-repair-loop.mp4" type="video/mp4" />
          </video>
          <div className="quote-media-shade" />
          <div className="quote-media-content">
            <FaCalendarCheck aria-hidden="true" />
            <h2>Free estimate, photo upload, and scheduling in one place.</h2>
            <p>
              Upload damage photos, choose a preferred mobile appointment window, or call {business.phone} for the
              free estimate listed on the service vehicle.
            </p>
          </div>
        </div>
        <form
          className="quote-form"
          aria-label="Free estimate and scheduling request"
          action="/api/estimates"
          method="post"
          encType="multipart/form-data"
        >
          {submission.estimate === 'sent' ? (
            <div className="form-alert form-alert-success" role="status">
              <strong>Estimate request received.</strong>
              <span>
                {submission.photos === 'failed'
                  ? `Your details were saved, but the photos could not be attached. Please text them to ${business.phone}.`
                  : submission.photos === 'partial'
                    ? `Your request and at least one optimized photo were saved. Some additional photos could not be converted; text those to ${business.phone} if they show important damage.`
                    : 'Your details and optimized photos are in the owner dashboard. CW Mobile Autobody will follow up using your preferred contact method.'}
              </span>
            </div>
          ) : null}
          {submission.estimate === 'photo-error' ? (
            <div className="form-alert form-alert-error" role="alert">
              <strong>A damage photo is required.</strong>
              <span>
                Add at least one image up to 8 MB. Images are automatically rotated, resized, and converted to WebP.
              </span>
            </div>
          ) : null}
          {submission.estimate === 'error' ? (
            <div className="form-alert form-alert-error" role="alert">
              <strong>We could not save the request.</strong>
              <span>
                Call or text <a href={`tel:${business.sms}`}>{business.phone}</a> and we will help directly.
              </span>
            </div>
          ) : null}
          <div className="form-heading">
            <p className="eyebrow dark">Free estimate</p>
            <h2>Request mobile service</h2>
            <p>No charge for photo estimates. Final repair time is confirmed after we review the damage.</p>
          </div>

          <div className="form-grid">
            <label>
              Name
              <input type="text" name="name" placeholder="Jordan Lee" autoComplete="name" required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder={business.phone} autoComplete="tel" required />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Email
              <input type="email" name="email" placeholder={business.email} autoComplete="email" />
            </label>
            <label>
              Service type
              <select name="serviceType" defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                {estimateTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label>
              Vehicle
              <input type="text" name="vehicle" placeholder="2021 Toyota Camry" />
            </label>
            <label>
              Service ZIP code
              <input type="text" name="zip" placeholder={business.zip} autoComplete="postal-code" />
            </label>
          </div>

          <fieldset className="upload-field">
            <legend>Upload damage photos</legend>
            <label className="upload-drop">
              <FaCamera aria-hidden="true" />
              <strong>Add photos or take new ones</strong>
              <span>Upload 1–8 images, up to 8 MB each. Files are automatically rotated, optimized, and converted to WebP.</span>
              <input type="file" name="damagePhotos" accept="image/*" multiple required />
            </label>
          </fieldset>

          <label>
            Vehicle and damage notes
            <textarea name="damage" rows={5} placeholder="Rear bumper scuff, driver door ding, paint chip near wheel arch..." />
          </label>

          <fieldset className="schedule-field">
            <legend>Preferred appointment</legend>
            <div className="form-grid">
              <label>
                Date
                <input type="date" name="appointmentDate" />
              </label>
              <label>
                Time window
                <select name="appointmentWindow" defaultValue="">
                  <option value="" disabled>
                    Select window
                  </option>
                  {appointmentWindows.map((window) => (
                    <option key={window}>{window}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Service address
              <input type="text" name="serviceAddress" placeholder="Home, office, fleet yard, or dealership address" autoComplete="street-address" />
            </label>
            <div className="radio-row" role="radiogroup" aria-label="Preferred contact method">
              <label>
                <input type="radio" name="contactPreference" value="text" defaultChecked /> Text
              </label>
              <label>
                <input type="radio" name="contactPreference" value="call" /> Call
              </label>
              <label>
                <input type="radio" name="contactPreference" value="email" /> Email
              </label>
            </div>
          </fieldset>

          <button className="btn btn-primary" type="submit">
            Send free estimate request <FaCalendarCheck aria-hidden="true" />
          </button>
          <p className="form-note">No deposit is required. Same-day mobile service is offered when scheduling allows.</p>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <Image className="footer-mark" src="/cw-mark.svg" alt="" width={64} height={64} />
          <div>
            <strong>{business.name.replace(/^CW\s+/i, '')}</strong>
            <p>{business.tagline}</p>
          </div>
        </div>
        <div className="footer-actions">
          <address>
            <a href={`tel:${business.sms}`}>
              <FaPhone aria-hidden="true" /> {business.phone}
            </a>
            <a href={`mailto:${business.email}`}>
              <FaEnvelope aria-hidden="true" /> {business.email}
            </a>
            <a href={business.mapUrl}>
              <FaLocationDot aria-hidden="true" /> {business.city}, {business.state}
            </a>
          </address>
          <a className="footer-owner-login" href="/cms">
            <FaLock aria-hidden="true" /> Owner login
          </a>
        </div>
      </footer>

      <nav className="mobile-cta" aria-label="Mobile quick actions">
        <a href={`tel:${business.sms}`}>
          <FaPhone aria-hidden="true" /> Call
        </a>
        <a href="#quote">
          <FaCarBurst aria-hidden="true" /> Quote
        </a>
      </nav>
    </main>
  );
}
