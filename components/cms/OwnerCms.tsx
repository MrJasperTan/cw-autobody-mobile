'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  FaArrowRight,
  FaBoxArchive,
  FaCheck,
  FaClipboardList,
  FaImage,
  FaPenToSquare,
  FaPlus,
  FaRotate,
  FaScrewdriverWrench,
  FaTrash,
} from 'react-icons/fa6';
import type { CmsContent } from '@/lib/cms-content';
import type { EstimateRequest, EstimateStatus } from '@/lib/estimates';
import type { BeforeAfterProject } from '@/lib/site-data';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type CmsView = 'page-edits' | 'free-estimates' | 'work-management';
type PageEditView = 'website' | 'gallery';

const statusOptions: EstimateStatus[] = ['new', 'reviewing', 'scheduled', 'completed', 'archived'];

const newProject = (): BeforeAfterProject => ({
  id: `repair-${Date.now()}`,
  title: '',
  service: '',
  description: '',
  beforeImage: '',
  beforeAlt: '',
  afterImage: '',
  afterAlt: '',
  rating: 5,
  customerName: '',
  customerReview: '',
});

export default function OwnerCms() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<CmsContent | null>(null);
  const [estimates, setEstimates] = useState<EstimateRequest[]>([]);
  const [error, setError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [beforeAfterProjects, setBeforeAfterProjects] = useState<BeforeAfterProject[]>([]);
  const [gallerySaveState, setGallerySaveState] = useState<SaveState>('idle');
  const [uploadingSlot, setUploadingSlot] = useState('');
  const [activeView, setActiveView] = useState<CmsView>('page-edits');
  const [pageEditView, setPageEditView] = useState<PageEditView>('website');

  const loadOwnerData = async () => {
    const [contentResponse, estimatesResponse] = await Promise.all([
      fetch('/api/cms/content', { cache: 'no-store' }),
      fetch('/api/cms/estimates', { cache: 'no-store' }),
    ]);

    if (contentResponse.status === 401 || estimatesResponse.status === 401) {
      setAuthenticated(false);
      return;
    }

    if (!contentResponse.ok) {
      throw new Error('Unable to load CMS content.');
    }

    if (!estimatesResponse.ok) {
      throw new Error('Unable to load estimate requests.');
    }

    const nextContent = await contentResponse.json() as CmsContent;
    setContent(nextContent);
    setBeforeAfterProjects(nextContent.beforeAfterProjects);
    setEstimates(await estimatesResponse.json() as EstimateRequest[]);
    setAuthenticated(true);
  };

  useEffect(() => {
    const hydrate = async () => {
      const sessionResponse = await fetch('/api/cms/session', { cache: 'no-store' });

      if (!sessionResponse.ok) {
        throw new Error('Unable to check owner session.');
      }

      const session = await sessionResponse.json() as { authenticated?: boolean };

      if (session.authenticated) {
        await loadOwnerData();
      }
    };

    hydrate()
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/cms/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || 'Login failed.');
      return;
    }

    setPassword('');
    setLoading(true);
    await loadOwnerData().catch((loadError: Error) => setError(loadError.message));
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/api/cms/session', { method: 'DELETE' });
    setAuthenticated(false);
    setContent(null);
    setEstimates([]);
  };

  const saveContent = async () => {
    if (!content) {
      return;
    }

    setSaveState('saving');
    setError('');

    const response = await fetch('/api/cms/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || 'Could not save content.');
      setSaveState('error');
      return;
    }

    const nextContent = await response.json() as CmsContent;
    setContent(nextContent);
    setBeforeAfterProjects(nextContent.beforeAfterProjects);
    setSaveState('saved');
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) {
      return '';
    }

    const formData = new FormData();
    formData.append('file', file);
    setError('');

    const response = await fetch('/api/cms/upload', {
      method: 'POST',
      body: formData,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Upload failed.');
      return '';
    }

    return body.src as string;
  };

  const updateBusiness = (field: keyof CmsContent['business'], value: string) => {
    setContent((current) => current ? {
      ...current,
      business: { ...current.business, [field]: value },
    } : current);
    setSaveState('idle');
  };

  const updateSiteImage = async (
    field: keyof CmsContent['images'],
    file: File | undefined,
  ) => {
    if (!file) {
      return;
    }

    const key = `site-${field}`;
    setUploadingSlot(key);
    const src = await uploadImage(file);
    setUploadingSlot('');

    if (src) {
      setContent((current) => current ? {
        ...current,
        images: { ...current.images, [field]: src },
      } : current);
      setSaveState('idle');
    }
  };

  const updateService = (
    index: number,
    field: keyof CmsContent['services'][number],
    value: string,
  ) => {
    setContent((current) => current ? {
      ...current,
      services: current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service),
    } : current);
    setSaveState('idle');
  };

  const updateFaq = (
    index: number,
    field: keyof CmsContent['faqs'][number],
    value: string,
  ) => {
    setContent((current) => current ? {
      ...current,
      faqs: current.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq),
    } : current);
    setSaveState('idle');
  };

  const updateProject = (id: string, updates: Partial<BeforeAfterProject>) => {
    setBeforeAfterProjects((current) =>
      current.map((project) => project.id === id ? { ...project, ...updates } : project),
    );
    setGallerySaveState('idle');
  };

  const uploadProjectImage = async (
    projectId: string,
    slot: 'beforeImage' | 'afterImage',
    file: File | undefined,
  ) => {
    if (!file) {
      return;
    }

    const key = `${projectId}-${slot}`;
    setUploadingSlot(key);
    const src = await uploadImage(file);
    setUploadingSlot('');

    if (src) {
      updateProject(projectId, { [slot]: src });
    }
  };

  const saveBeforeAfter = async () => {
    if (!content) {
      return;
    }

    const incomplete = beforeAfterProjects.find(
      (project) => !project.title.trim() || !project.beforeImage || !project.afterImage,
    );

    if (incomplete) {
      setError('Each gallery project needs a title, a Before image, and an After image before it can be published.');
      setGallerySaveState('error');
      return;
    }

    setError('');
    setGallerySaveState('saving');
    const response = await fetch('/api/cms/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...content, beforeAfterProjects }),
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Could not publish the before-and-after gallery.');
      setGallerySaveState('error');
      return;
    }

    const nextContent = body as CmsContent;
    setContent(nextContent);
    setBeforeAfterProjects(nextContent.beforeAfterProjects);
    setGallerySaveState('saved');
  };

  const updateStatus = async (id: string, status: EstimateStatus) => {
    const response = await fetch('/api/cms/estimates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error || 'Could not update estimate status.');
      return;
    }

    setEstimates((current) =>
      current.map((estimate) => estimate.id === id ? { ...estimate, status } : estimate),
    );
  };

  const newEstimates = estimates.filter((estimate) => estimate.status === 'new');
  const managedEstimates = estimates.filter((estimate) => estimate.status !== 'new');
  const workflowStatuses: EstimateStatus[] = ['reviewing', 'scheduled', 'completed', 'archived'];

  const renderEstimate = (estimate: EstimateRequest, intake = false) => (
    <article key={estimate.id} className="lead-item">
      <div>
        <p className="lead-meta">{estimate.createdAt} · {estimate.serviceType || 'Service not selected'}</p>
        <h3>{estimate.name}</h3>
        <p>{estimate.vehicle || 'Vehicle not provided'} · {estimate.zip || 'ZIP not provided'}</p>
        <p>{estimate.appointmentDate || 'No date'} · {estimate.appointmentWindow || 'No time window'}</p>
        {estimate.serviceAddress ? <p>{estimate.serviceAddress}</p> : null}
        {estimate.damageNotes ? <p>{estimate.damageNotes}</p> : null}
        <div className="lead-contact">
          <a href={`tel:${estimate.phone}`}>{estimate.phone}</a>
          {estimate.email ? <a href={`mailto:${estimate.email}`}>{estimate.email}</a> : null}
        </div>
        {estimate.images.length ? (
          <div className="lead-images">
            {estimate.images.map((image) => (
              <a key={image} href={image} target="_blank" rel="noreferrer">
                <img src={image} alt={`${estimate.name} vehicle damage`} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
      {intake ? (
        <div className="lead-actions">
          <button className="btn btn-primary" type="button" onClick={() => updateStatus(estimate.id, 'reviewing')}>
            Move to work <FaArrowRight aria-hidden="true" />
          </button>
          <button className="btn btn-secondary dark-button" type="button" onClick={() => updateStatus(estimate.id, 'archived')}>
            <FaBoxArchive aria-hidden="true" /> Archive
          </button>
        </div>
      ) : (
        <label className="status-control">
          Work status
          <select
            value={estimate.status}
            onChange={(event) => updateStatus(estimate.id, event.target.value as EstimateStatus)}
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      )}
    </article>
  );

  if (loading) {
    return <main className="cms-shell"><section className="cms-panel">Loading owner CMS...</section></main>;
  }

  if (!authenticated) {
    return (
      <main className="cms-shell">
        <section className="cms-login">
          <p className="eyebrow dark">Owner CMS</p>
          <h1 className="cms-brand-title">
            <Image src="/cw-mark.svg" alt="CW" width={72} height={72} priority />
            <span>Mobile Autobody</span>
          </h1>
          <p>Manage website content, R2 image uploads, and Turso estimate requests.</p>
          <form onSubmit={login}>
            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
              />
            </label>
            <button className="btn btn-primary" type="submit">Log in</button>
          </form>
          {error ? <p className="cms-error">{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="cms-shell">
      <header className="cms-topbar">
        <div>
          <p className="eyebrow dark">Owner CMS</p>
          <h1>Business workspace</h1>
        </div>
        <button className="btn btn-secondary dark-button" type="button" onClick={logout}>Log out</button>
      </header>

      <nav className="cms-view-toggle" aria-label="CMS sections">
        <button
          type="button"
          className={activeView === 'page-edits' ? 'is-active' : ''}
          onClick={() => setActiveView('page-edits')}
          aria-current={activeView === 'page-edits' ? 'page' : undefined}
        >
          <FaPenToSquare aria-hidden="true" />
          <span>Page edits</span>
        </button>
        <button
          type="button"
          className={activeView === 'free-estimates' ? 'is-active' : ''}
          onClick={() => setActiveView('free-estimates')}
          aria-current={activeView === 'free-estimates' ? 'page' : undefined}
        >
          <FaClipboardList aria-hidden="true" />
          <span>Free estimates</span>
          <strong aria-label={`${newEstimates.length} new estimates`}>{newEstimates.length}</strong>
        </button>
        <button
          type="button"
          className={activeView === 'work-management' ? 'is-active' : ''}
          onClick={() => setActiveView('work-management')}
          aria-current={activeView === 'work-management' ? 'page' : undefined}
        >
          <FaScrewdriverWrench aria-hidden="true" />
          <span>Work management</span>
          <strong aria-label={`${managedEstimates.length} managed jobs`}>{managedEstimates.length}</strong>
        </button>
      </nav>

      {error ? <p className="cms-error">{error}</p> : null}

      {activeView === 'page-edits' ? <>
      <nav className="page-edit-toggle" aria-label="Page editing sections">
        <button
          type="button"
          className={pageEditView === 'website' ? 'is-active' : ''}
          onClick={() => setPageEditView('website')}
        >
          <FaPenToSquare aria-hidden="true" /> Business and website
        </button>
        <button
          type="button"
          className={pageEditView === 'gallery' ? 'is-active' : ''}
          onClick={() => setPageEditView('gallery')}
        >
          <FaImage aria-hidden="true" /> Before and after gallery
        </button>
      </nav>

      {pageEditView === 'gallery' ? (
      <section className="cms-panel gallery-manager">
        <div className="cms-panel-heading">
          <div>
            <h2>Before &amp; After Gallery</h2>
            <p>Add real completed work to the public comparison carousel. A title and both photos are required.</p>
          </div>
          <div className="cms-gallery-actions">
            <button
              className="btn btn-secondary dark-button"
              type="button"
              onClick={() => setBeforeAfterProjects((current) => [...current, newProject()])}
            >
              <FaPlus aria-hidden="true" /> Add repair
            </button>
            <button className="btn btn-primary" type="button" onClick={saveBeforeAfter}>
              {gallerySaveState === 'saving' ? 'Publishing...' : gallerySaveState === 'saved' ? (
                <><FaCheck aria-hidden="true" /> Published</>
              ) : 'Publish gallery'}
            </button>
          </div>
        </div>

        {beforeAfterProjects.length === 0 ? (
          <div className="gallery-empty">
            <FaImage aria-hidden="true" />
            <h3>No repair pairs published</h3>
            <p>Add the first completed repair. The gallery stays hidden on the website until a complete pair is published.</p>
          </div>
        ) : (
          <div className="gallery-editor-list">
            {beforeAfterProjects.map((project, index) => (
              <article className="gallery-editor" key={project.id}>
                <header>
                  <strong>Repair {index + 1}</strong>
                  <button
                    type="button"
                    className="icon-button danger-button"
                    onClick={() => {
                      setBeforeAfterProjects((current) => current.filter((item) => item.id !== project.id));
                      setGallerySaveState('idle');
                    }}
                    aria-label={`Remove ${project.title || `repair ${index + 1}`}`}
                    title="Remove repair"
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </header>

                <div className="gallery-fields">
                  <label>
                    Repair title <span aria-hidden="true">*</span>
                    <input
                      value={project.title}
                      onChange={(event) => updateProject(project.id, { title: event.target.value })}
                      placeholder="Rear bumper scrape repair"
                      required
                    />
                  </label>
                  <label>
                    Service type
                    <input
                      value={project.service}
                      onChange={(event) => updateProject(project.id, { service: event.target.value })}
                      placeholder="Plastic bumper repair"
                    />
                  </label>
                </div>

                <label>
                  Short result description
                  <input
                    value={project.description}
                    onChange={(event) => updateProject(project.id, { description: event.target.value })}
                    placeholder="Scuff repaired and finish color-matched on site."
                  />
                </label>

                <fieldset className="project-review-fields">
                  <legend>Customer review</legend>
                  <div className="gallery-fields">
                    <label>
                      Star rating
                      <select
                        value={project.rating || 5}
                        onChange={(event) => updateProject(project.id, { rating: Number(event.target.value) })}
                      >
                        <option value={5}>5 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={3}>3 stars</option>
                        <option value={2}>2 stars</option>
                        <option value={1}>1 star</option>
                      </select>
                    </label>
                    <label>
                      Customer name
                      <input
                        value={project.customerName || ''}
                        onChange={(event) => updateProject(project.id, { customerName: event.target.value })}
                        placeholder="First name or initials"
                      />
                    </label>
                  </div>
                  <label>
                    Review
                    <textarea
                      rows={3}
                      value={project.customerReview || ''}
                      onChange={(event) => updateProject(project.id, { customerReview: event.target.value })}
                      placeholder="Add the customer's feedback about this repair."
                    />
                  </label>
                </fieldset>

                <div className="pair-upload-grid">
                  {(['beforeImage', 'afterImage'] as const).map((slot) => {
                    const isBefore = slot === 'beforeImage';
                    const src = project[slot];
                    const altKey = isBefore ? 'beforeAlt' : 'afterAlt';
                    const label = isBefore ? 'Before' : 'After';
                    const isUploading = uploadingSlot === `${project.id}-${slot}`;

                    return (
                      <fieldset className="pair-upload" key={slot}>
                        <legend>{label} photo <span aria-hidden="true">*</span></legend>
                        <label className={src ? 'pair-photo has-photo' : 'pair-photo'}>
                          {src ? <img src={src} alt={`${label} preview for ${project.title || 'repair'}`} /> : <FaImage aria-hidden="true" />}
                          <span>{isUploading ? 'Optimizing...' : src ? `Replace ${label.toLowerCase()} photo` : `Upload ${label.toLowerCase()} photo`}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                            onChange={(event) => uploadProjectImage(project.id, slot, event.target.files?.[0])}
                            disabled={Boolean(uploadingSlot)}
                            required={!src}
                          />
                        </label>
                        <label>
                          Image description
                          <input
                            value={project[altKey]}
                            onChange={(event) => updateProject(project.id, { [altKey]: event.target.value })}
                            placeholder={`${project.title || 'Vehicle damage'} ${label.toLowerCase()} repair`}
                          />
                        </label>
                      </fieldset>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      ) : null}

      {pageEditView === 'website' && content ? (
        <section className="cms-panel content-editor">
          <div className="cms-panel-heading content-editor-heading">
            <div>
              <h2>Website details</h2>
              <p>Business information and wording shown on the public website.</p>
            </div>
            <button className="btn btn-primary" type="button" onClick={saveContent} disabled={saveState === 'saving'}>
              {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? (
                <><FaCheck aria-hidden="true" /> Changes saved</>
              ) : 'Save page changes'}
            </button>
          </div>

          <div className="content-sections">
            <details className="content-section" open>
              <summary>Business information</summary>
              <div className="content-form-grid">
                <label>
                  Business name
                  <input value={content.business.name} onChange={(event) => updateBusiness('name', event.target.value)} />
                </label>
                <label>
                  Phone number
                  <input type="tel" value={content.business.phone} onChange={(event) => updateBusiness('phone', event.target.value)} />
                </label>
                <label className="full-field">
                  Main headline
                  <input value={content.business.tagline} onChange={(event) => updateBusiness('tagline', event.target.value)} />
                </label>
                <label className="full-field">
                  Business description
                  <textarea rows={5} value={content.business.description} onChange={(event) => updateBusiness('description', event.target.value)} />
                </label>
                <label>
                  Email address
                  <input type="email" value={content.business.email} onChange={(event) => updateBusiness('email', event.target.value)} />
                </label>
                <label>
                  Service area
                  <input value={content.business.serviceArea} onChange={(event) => updateBusiness('serviceArea', event.target.value)} />
                </label>
                <label>
                  City
                  <input value={content.business.city} onChange={(event) => updateBusiness('city', event.target.value)} />
                </label>
                <div className="content-form-grid compact-fields">
                  <label>
                    State
                    <input value={content.business.state} onChange={(event) => updateBusiness('state', event.target.value)} />
                  </label>
                  <label>
                    ZIP code
                    <input inputMode="numeric" value={content.business.zip} onChange={(event) => updateBusiness('zip', event.target.value)} />
                  </label>
                </div>
              </div>
            </details>

            <details className="content-section">
              <summary>Homepage photos</summary>
              <div className="site-image-grid">
                {([
                  { field: 'repair' as const, label: 'Mobile estimate section' },
                  { field: 'detail' as const, label: 'Service details section' },
                ]).map(({ field, label }) => (
                  <div className="site-image-editor" key={field}>
                    <strong>{label}</strong>
                    <div className="site-image-preview">
                      <img src={content.images[field]} alt={`${label} preview`} />
                    </div>
                    <label className="btn btn-secondary dark-button site-image-upload">
                      <FaImage aria-hidden="true" />
                      {uploadingSlot === `site-${field}` ? 'Optimizing photo...' : 'Replace photo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        onChange={(event) => updateSiteImage(field, event.target.files?.[0])}
                        disabled={Boolean(uploadingSlot)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </details>

            <details className="content-section">
              <summary>Services</summary>
              <div className="content-list">
                {content.services.map((service, index) => (
                  <div className="content-list-item" key={`${service.name}-${index}`}>
                    <div className="content-list-heading">
                      <strong>Service {index + 1}</strong>
                      <button
                        type="button"
                        className="icon-button danger-button"
                        onClick={() => {
                          setContent((current) => current ? { ...current, services: current.services.filter((_, itemIndex) => itemIndex !== index) } : current);
                          setSaveState('idle');
                        }}
                        aria-label={`Remove ${service.name || `service ${index + 1}`}`}
                        title="Remove service"
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    </div>
                    <div className="content-form-grid">
                      <label>
                        Service name
                        <input value={service.name} onChange={(event) => updateService(index, 'name', event.target.value)} />
                      </label>
                      <label>
                        Price wording
                        <input value={service.price} onChange={(event) => updateService(index, 'price', event.target.value)} />
                      </label>
                      <label className="full-field">
                        Description
                        <textarea rows={3} value={service.description} onChange={(event) => updateService(index, 'description', event.target.value)} />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-secondary dark-button add-content-item"
                type="button"
                onClick={() => {
                  setContent((current) => current ? { ...current, services: [...current.services, { name: '', description: '', price: 'Starting at $99' }] } : current);
                  setSaveState('idle');
                }}
              >
                <FaPlus aria-hidden="true" /> Add service
              </button>
            </details>

            <details className="content-section">
              <summary>Frequently asked questions</summary>
              <div className="content-list">
                {content.faqs.map((faq, index) => (
                  <div className="content-list-item" key={`${faq.question}-${index}`}>
                    <div className="content-list-heading">
                      <strong>Question {index + 1}</strong>
                      <button
                        type="button"
                        className="icon-button danger-button"
                        onClick={() => {
                          setContent((current) => current ? { ...current, faqs: current.faqs.filter((_, itemIndex) => itemIndex !== index) } : current);
                          setSaveState('idle');
                        }}
                        aria-label={`Remove ${faq.question || `question ${index + 1}`}`}
                        title="Remove question"
                      >
                        <FaTrash aria-hidden="true" />
                      </button>
                    </div>
                    <label>
                      Question
                      <input value={faq.question} onChange={(event) => updateFaq(index, 'question', event.target.value)} />
                    </label>
                    <label>
                      Answer
                      <textarea rows={4} value={faq.answer} onChange={(event) => updateFaq(index, 'answer', event.target.value)} />
                    </label>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-secondary dark-button add-content-item"
                type="button"
                onClick={() => {
                  setContent((current) => current ? { ...current, faqs: [...current.faqs, { question: '', answer: '' }] } : current);
                  setSaveState('idle');
                }}
              >
                <FaPlus aria-hidden="true" /> Add question
              </button>
            </details>
          </div>
        </section>
      ) : null}

      </> : null}

      {activeView === 'free-estimates' ? (
        <section className="cms-panel">
          <div className="cms-panel-heading">
            <div>
              <h2>New estimate requests</h2>
              <p>Review incoming customer details and damage photos, then move accepted requests into the work queue.</p>
            </div>
            <button className="btn btn-secondary dark-button" type="button" onClick={() => loadOwnerData()}>
              <FaRotate aria-hidden="true" /> Refresh
            </button>
          </div>
          <div className="lead-list">
            {newEstimates.length === 0 ? (
              <div className="cms-empty-state">
                <FaClipboardList aria-hidden="true" />
                <h3>No new estimate requests</h3>
                <p>New photo estimates will appear here for review.</p>
              </div>
            ) : newEstimates.map((estimate) => renderEstimate(estimate, true))}
          </div>
        </section>
      ) : null}

      {activeView === 'work-management' ? (
        <section className="cms-panel work-manager">
          <div className="cms-panel-heading">
            <div>
              <h2>Work management</h2>
              <p>Track accepted repairs from initial review through scheduling and completion.</p>
            </div>
            <button className="btn btn-secondary dark-button" type="button" onClick={() => loadOwnerData()}>
              <FaRotate aria-hidden="true" /> Refresh
            </button>
          </div>

          <div className="workflow-summary" aria-label="Work status summary">
            {workflowStatuses.map((status) => (
              <div key={status}>
                <strong>{managedEstimates.filter((estimate) => estimate.status === status).length}</strong>
                <span>{status}</span>
              </div>
            ))}
          </div>

          <div className="workflow-groups">
            {workflowStatuses.map((status) => {
              const jobs = managedEstimates.filter((estimate) => estimate.status === status);

              return (
                <section className="workflow-group" key={status}>
                  <header>
                    <h3>{status}</h3>
                    <span>{jobs.length}</span>
                  </header>
                  {jobs.length ? (
                    <div className="lead-list">{jobs.map((estimate) => renderEstimate(estimate))}</div>
                  ) : (
                    <p className="workflow-empty">No {status} work.</p>
                  )}
                </section>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
