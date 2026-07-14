'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa6';
import type { BeforeAfterProject } from '@/lib/site-data';

type BeforeAfterCarouselProps = {
  projects: BeforeAfterProject[];
};

const INITIAL_REVEAL = 25;

export default function BeforeAfterCarousel({ projects }: BeforeAfterCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reveal, setReveal] = useState(INITIAL_REVEAL);
  const displayedProjects = projects;
  const activeProject = displayedProjects[activeIndex] || displayedProjects[0];

  if (!activeProject) {
    return null;
  }

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setReveal(INITIAL_REVEAL);
  };

  const move = (direction: -1 | 1) => {
    selectProject((activeIndex + direction + displayedProjects.length) % displayedProjects.length);
  };

  return (
    <section id="results" className="results-section" aria-labelledby="results-heading">
      <header className="results-heading">
        <div>
          <p className="eyebrow">Before and after</p>
          <h2 id="results-heading">Move the handle. Inspect the repair.</h2>
        </div>
        <p>
          {activeProject.isReference
            ? 'Temporary restoration example. Add verified CW repairs and customer feedback through the owner CMS.'
            : 'CW Mobile Autobody work, photographed before service and after the finished repair.'}
        </p>
      </header>

      <div className="comparison-stage">
        <figure className="comparison-frame">
          <img
            className="comparison-image comparison-before"
            src={activeProject.beforeImage}
            alt={activeProject.beforeAlt || `${activeProject.title} before repair`}
          />
          <div
            className="comparison-after-wrap"
            style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
            aria-hidden="true"
          >
            <img
              className="comparison-image comparison-after"
              src={activeProject.afterImage}
              alt=""
            />
          </div>
          <span className="comparison-label comparison-label-before">Before</span>
          <span className="comparison-label comparison-label-after">After</span>
          <span className="comparison-divider" style={{ left: `${reveal}%` }} aria-hidden="true">
            <i><FaArrowLeft /><FaArrowRight /></i>
          </span>
          <input
            className="comparison-range"
            type="range"
            min="0"
            max="100"
            value={reveal}
            onChange={(event) => setReveal(Number(event.target.value))}
            aria-label={`Reveal the after image for ${activeProject.title}`}
          />
          <figcaption className="sr-only">
            Before and after comparison of {activeProject.title}. After image: {activeProject.afterAlt}.
          </figcaption>
        </figure>

        <div className="comparison-details" aria-live="polite">
          <div>
            <span>{activeProject.service || 'Completed mobile repair'}</span>
            <h3>{activeProject.title}</h3>
            {activeProject.description ? <p>{activeProject.description}</p> : null}
            {activeProject.customerReview ? (
              <figure className="project-customer-review">
                <figcaption>Customer review</figcaption>
                <div className="project-rating" aria-label={`${activeProject.rating || 5} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                      key={index}
                      aria-hidden="true"
                      className={index < (activeProject.rating || 5) ? 'is-filled' : undefined}
                    />
                  ))}
                </div>
                <blockquote>&ldquo;{activeProject.customerReview}&rdquo;</blockquote>
                {activeProject.customerName ? <cite>{activeProject.customerName}</cite> : null}
              </figure>
            ) : null}
          </div>

          {displayedProjects.length > 1 ? (
            <div className="carousel-controls">
              <span>{String(activeIndex + 1).padStart(2, '0')} / {String(displayedProjects.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => move(-1)} aria-label="Show previous repair">
                <FaArrowLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Show next repair">
                <FaArrowRight aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {displayedProjects.length > 1 ? (
        <div className="project-tabs" role="tablist" aria-label="Repair projects">
          {displayedProjects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => selectProject(index)}
            >
              <img src={project.afterImage} alt="" />
              <span>{project.title}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
