import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

import carloftyImg    from '../assets/images/carlofty-case-study.png';
import barakaImg      from '../assets/images/baraka-card.jpg';

import carloftyVideo  from '../assets/videos/carlofty-outcome.mp4';
import barakaVideo    from '../assets/videos/baraka-demo.mp4';

import './SelectedProjects.css';

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Case study card — supports hover video ─── */
function CaseStudyCard({
  title, description, image, video, slug, onReadCaseStudy,
}: {
  title: string; description: string; image: string;
  video?: string; slug?: string;
  onReadCaseStudy?: (slug?: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    if (!video) return;
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    if (!video) return;
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

  const handleClick = () => onReadCaseStudy?.(slug);

  return (
    <div
      className="case-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      style={{ cursor: onReadCaseStudy ? 'pointer' : 'default' }}
    >
      <div className="case-card__image" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <img
          src={image}
          alt={title}
          className={`case-card__img${hovered ? ' case-card__img--hidden' : ''}`}
        />
        {video && (
          <video
            ref={videoRef}
            src={video}
            poster={image}
            className={`case-card__video${hovered ? ' case-card__video--visible' : ''}`}
            muted loop playsInline preload="auto"
          />
        )}
      </div>
      <div className="case-card__body">
        <h3 className="case-card__title">{title}</h3>
        <p className="case-card__desc">{description}</p>
        <span className="case-card__link">
          <span>Read Case Study</span>
          <ArrowUpRightIcon className="case-card__link-arrow" />
        </span>
      </div>
    </div>
  );
}

/* ── Live project card ────────────────────── */
function LiveProjectCard({
  title, image, video, href,
}: {
  title: string; image: string;
  video?: string; href?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    if (!video) return;
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    if (!video) return;
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

  const cardContent = (
    <>
      <div className="case-card__image" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <img
          src={image}
          alt={title}
          className={`case-card__img${hovered ? ' case-card__img--hidden' : ''}`}
        />
        {video && (
          <video
            ref={videoRef}
            src={video}
            poster={image}
            className={`case-card__video${hovered ? ' case-card__video--visible' : ''}`}
            muted loop playsInline preload="auto"
          />
        )}
      </div>
      <div className="case-card__body">
        <h3 className="case-card__title">{title}</h3>
        {href && (
          <span className="case-card__link">
            <span>Visit site</span>
            <ArrowUpRightIcon className="case-card__link-arrow" />
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="case-card case-card--link">
        {cardContent}
      </a>
    );
  }

  return <div className="case-card">{cardContent}</div>;
}

/* ── Static live projects shown on homepage ── */
const liveProjects = [
  {
    id: 'baraka',
    title: 'Baraka — Landing page redesign',
    image: barakaImg,
    video: barakaVideo,
    href: 'https://barakaredesign.framer.website/',
  },
];

interface SelectedProjectsProps {
  onReadCaseStudy?: (slug?: string) => void;
}

interface SupabaseStudy {
  slug: string;
  card_image_url: string | null;
  card_video_url: string | null;
  content: Record<string, unknown>;
}

export default function SelectedProjects({ onReadCaseStudy }: SelectedProjectsProps) {
  const [monnify, setMonnify] = useState<SupabaseStudy | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('case_studies')
          .select('slug, card_image_url, card_video_url, content')
          .eq('published', true)
          .ilike('slug', '%monnify%')
          .limit(1)
          .single();
        if (data) setMonnify(data as SupabaseStudy);
      } catch { /* silently skip */ }
    })();
  }, []);

  const monnifyHero = monnify
    ? ((monnify.content as Record<string, unknown>)?.hero ?? {}) as Record<string, unknown>
    : null;

  return (
    <div className="selected-projects">
      {/* ── Case Studies ─────────────────────────── */}
      <div className="selected-projects__header">
        <div className="selected-projects__title-group">
          <h2 className="selected-projects__heading">Selected Case Studies</h2>
          <p className="selected-projects__subheading">A record of my thoughtful process</p>
        </div>
      </div>

      <div className="selected-projects__list">
        {/* Carlofty — hardcoded, always first */}
        <CaseStudyCard
          title="Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing."
          description="Global car auctions shouldn't require a middleman. Carlofty was designed to give Nigerian buyers direct, transparent access to Copart, Manheim, and IAAI — from a single platform they could actually trust."
          image={carloftyImg}
          video={carloftyVideo}
          onReadCaseStudy={onReadCaseStudy}
        />

        {/* Monnify — from Supabase */}
        {monnify && (
          <CaseStudyCard
            title={(monnifyHero?.title as string) || 'Monnify Studio'}
            description={(monnifyHero?.subtitle as string) || ''}
            image={monnify.card_image_url || ''}
            video={monnify.card_video_url || undefined}
            slug={monnify.slug}
            onReadCaseStudy={onReadCaseStudy}
          />
        )}
      </div>

      {/* ── Live Projects ─────────────────────────── */}
      <div className="selected-projects__header" style={{ marginTop: 16 }}>
        <div className="selected-projects__title-group">
          <h2 className="selected-projects__heading">Live &amp; Exploration Projects</h2>
          <p className="selected-projects__subheading">Products shipped into the real world</p>
        </div>
      </div>

      <div className="selected-projects__list">
        {liveProjects.map((p) => (
          <LiveProjectCard
            key={p.id}
            title={p.title}
            image={p.image}
            video={'video' in p ? (p as { video?: string }).video : undefined}
            href={'href' in p ? (p as { href?: string }).href : undefined}
          />
        ))}
      </div>
    </div>
  );
}
