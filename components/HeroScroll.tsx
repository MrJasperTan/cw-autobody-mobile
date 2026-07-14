'use client';

import NextImage from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaArrowRight, FaCheck, FaPhone } from 'react-icons/fa6';

const FRAME_COUNT = 101;

type HeroScrollProps = {
  businessName: string;
  frameBase: string;
  poster: string;
  phone: string;
  sms: string;
  tagline: string;
  quoteUrl: string;
  proof: string[];
};

export default function HeroScroll({
  businessName,
  frameBase,
  phone,
  poster,
  proof,
  quoteUrl,
  sms,
  tagline,
}: HeroScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<Array<HTMLImageElement | undefined>>(Array(FRAME_COUNT));
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const drawFrame = (requestedIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let index = requestedIndex;
      while (index > 0 && !framesRef.current[index]?.complete) index -= 1;
      const image = framesRef.current[index];
      if (!image?.complete || !image.naturalWidth) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const nextWidth = Math.round(width * pixelRatio);
      const nextHeight = Math.round(height * pixelRatio);

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.fillStyle = '#101114';
      context.fillRect(0, 0, width, height);

      const isMobile = width <= 680;
      const mobileMediaTop = 72;
      const content = sectionRef.current?.querySelector<HTMLElement>('.hero-content');
      const contentTop = content ? content.getBoundingClientRect().top - bounds.top : height * 0.46;
      const mobileMediaHeight = Math.max(100, contentTop - mobileMediaTop - 12);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const renderedWidth = image.naturalWidth * scale;
      const renderedHeight = image.naturalHeight * scale;
      const x = (width - renderedWidth) / 2;
      const y = (height - renderedHeight) / 2;

      if (isMobile) {
        const progress = index / (FRAME_COUNT - 1);
        const sourceX = 180 - progress * 100;
        const sourceY = 210 - progress * 200;
        const sourceWidth = 1560 + progress * 200;
        const sourceHeight = 700 + progress * 340;
        const destinationHeight = width * (sourceHeight / sourceWidth);
        const destinationY = mobileMediaTop + (mobileMediaHeight - destinationHeight) / 2;

        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          destinationY,
          width,
          destinationHeight,
        );
      } else {
        context.drawImage(image, x, y, renderedWidth, renderedHeight);
      }
    };

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
      drawFrame(frameIndex);
      section.style.setProperty('--hero-progress', String(progress));
      rafRef.current = null;
    };

    const requestUpdate = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(update);
    };

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          framesRef.current[index] = image;
          if (index === 0 && !cancelled) {
            setReady(true);
            drawFrame(0);
          }
          resolve();
        };
        image.onerror = () => resolve();
        image.src = `${frameBase}/frame_${String(index + 1).padStart(4, '0')}.webp`;
      });

    const loadFrames = async () => {
      await loadFrame(0);
      for (let start = 1; start < FRAME_COUNT && !cancelled; start += 8) {
        const batch = Array.from({ length: Math.min(8, FRAME_COUNT - start) }, (_, offset) =>
          loadFrame(start + offset),
        );
        await Promise.all(batch);
        requestUpdate();
      }
    };

    void loadFrames();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    const resizeObserver = new ResizeObserver(requestUpdate);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    requestUpdate();

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      resizeObserver.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [frameBase]);

  return (
    <section
      id="top"
      className={`hero hero-scroll ${ready ? 'is-ready' : ''}`}
      ref={sectionRef}
      style={{ '--hero-poster': `url(${poster})` } as React.CSSProperties}
    >
      <div className="hero-sticky">
        <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Mobile Dent, Bumper, Paint & Light Collision Repair</p>
          <h1 className="hero-title-lockup">
            <NextImage src="/cw-mark.svg" alt="CW" width={104} height={104} priority />
            <span>{businessName.replace(/^CW\s+/i, '')}</span>
          </h1>
          <p className="hero-copy">{tagline}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={quoteUrl}>
              Get a free estimate <FaArrowRight aria-hidden="true" />
            </a>
            <a className="btn btn-secondary" href={`tel:${sms}`}>
              Call now <FaPhone aria-hidden="true" />
            </a>
          </div>
          <dl className="hero-proof">
            {proof.map((item) => (
              <div key={item}>
                <dt>
                  <FaCheck aria-hidden="true" />
                </dt>
                <dd>{item}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hero-repair-meter" aria-hidden="true">
          <span>Exterior</span>
          <i />
          <span>Every detail</span>
        </div>
        <a className="hero-phone" href={`tel:${sms}`} aria-label={`Call ${businessName} at ${phone}`}>
          <FaPhone aria-hidden="true" /> {phone}
        </a>
      </div>
    </section>
  );
}
