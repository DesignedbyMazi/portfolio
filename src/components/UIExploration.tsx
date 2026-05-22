import { useRef, useState } from 'react';
import './UIExploration.css';

/* ── Arrow icon ────────────────────────────────────────── */
function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Card data ─────────────────────────────────────────── */
interface UICardData {
  id: number;
  title: string;
  subtitle: string;
  bg: string;
  accentColor: string;
  iconEmoji: string;
  screenBg: string;
  tag?: string;
}

const CARDS: UICardData[] = [
  {
    id: 1,
    title: 'Pay4Me Redesign',
    subtitle:
      'The easiest and fastest way to pay tuition and fees to educational institutions, businesses, and government agencies worldwide.',
    bg: '#1B3A2D',
    accentColor: '#4ADE80',
    iconEmoji: '💳',
    screenBg: '#F0F4F1',
    tag: 'Fintech',
  },
  {
    id: 2,
    title: 'Baraka Landing Redesign',
    subtitle: 'Grow your wealth the smart way with auto-invest in US stocks & ETFs, powered by clear insights.',
    bg: '#0C0C14',
    accentColor: '#A78BFA',
    iconEmoji: '📈',
    screenBg: '#1A1A2E',
    tag: 'Investing',
  },
  {
    id: 3,
    title: 'Learnbeta Dashboard',
    subtitle: 'A reimagined learning experience that keeps students engaged and instructors in control.',
    bg: '#1A1A2E',
    accentColor: '#60A5FA',
    iconEmoji: '🎓',
    screenBg: '#0F1724',
    tag: 'EdTech',
  },
];

/* ── Browser chrome mock ───────────────────────────────── */
function BrowserChrome({ bg, accentColor, isPlaying }: { bg: string; accentColor: string; isPlaying: boolean }) {
  return (
    <div className={`ui-card__browser${isPlaying ? ' ui-card__browser--playing' : ''}`} style={{ background: bg }}>
      {/* Browser top bar */}
      <div className="ui-card__browser-bar">
        <span className="ui-card__dot" style={{ background: '#FF5F57' }} />
        <span className="ui-card__dot" style={{ background: '#FEBC2E' }} />
        <span className="ui-card__dot" style={{ background: '#28C840' }} />
        <div className="ui-card__url-bar">
          <span className="ui-card__url-text">app.design</span>
        </div>
      </div>
      {/* Screen area */}
      <div className="ui-card__screen-content">
        {/* Decorative content lines */}
        <div className="ui-card__mock-hero" style={{ background: `${accentColor}18` }}>
          <div className="ui-card__mock-line ui-card__mock-line--lg" style={{ background: accentColor }} />
          <div className="ui-card__mock-line ui-card__mock-line--md" style={{ background: `${accentColor}80` }} />
          <div className="ui-card__mock-line ui-card__mock-line--sm" style={{ background: `${accentColor}40` }} />
          <div
            className="ui-card__mock-btn"
            style={{ background: accentColor, color: bg }}
          >
            Get started
          </div>
        </div>
        <div className="ui-card__mock-footer">
          <div className="ui-card__mock-dot" style={{ background: `${accentColor}60` }} />
          <div className="ui-card__mock-dot" style={{ background: `${accentColor}40` }} />
          <div className="ui-card__mock-dot" style={{ background: `${accentColor}20` }} />
        </div>
      </div>
      {/* Playing indicator */}
      {isPlaying && (
        <div className="ui-card__play-badge">
          <span className="ui-card__play-sparkle">✦</span>
          <span className="ui-card__play-label">Playing</span>
        </div>
      )}
    </div>
  );
}

/* ── Single card ───────────────────────────────────────── */
function UICard({ card }: { card: UICardData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`ui-card${hovered ? ' ui-card--hovered' : ''}`}
      style={{ backgroundColor: card.bg }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tag pill */}
      {card.tag && (
        <span className="ui-card__tag" style={{ color: card.accentColor, borderColor: `${card.accentColor}40`, background: `${card.accentColor}12` }}>
          {card.tag}
        </span>
      )}

      {/* Header text */}
      <div className="ui-card__head">
        <p className="ui-card__title" style={{ color: '#FFFFFF' }}>
          {card.title}
        </p>
        <p className="ui-card__subtitle" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {card.subtitle}
        </p>
      </div>

      {/* Screen mockup */}
      <div className="ui-card__screen">
        <BrowserChrome bg={card.screenBg} accentColor={card.accentColor} isPlaying={hovered} />
      </div>

      {/* Hover glow */}
      <div className="ui-card__glow" style={{ background: `radial-gradient(ellipse at 50% 100%, ${card.accentColor}22 0%, transparent 70%)` }} />
    </div>
  );
}

/* ── Section ───────────────────────────────────────────── */
export default function UIExploration() {
  const [paused, setPaused] = useState(false);
  const [stickerVisible, setStickerVisible] = useState(true);
  const stickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCarouselEnter = () => {
    setPaused(true);
    // Hide sticker after first hover
    if (stickerVisible) {
      if (stickerTimerRef.current) clearTimeout(stickerTimerRef.current);
      stickerTimerRef.current = setTimeout(() => setStickerVisible(false), 600);
    }
  };

  const handleCarouselLeave = () => {
    setPaused(false);
  };

  // Duplicate cards for seamless infinite loop
  const allCards = [...CARDS, ...CARDS];

  return (
    <section className="ui-exploration">
      {/* Section header */}
      <div className="ui-exploration__header">
        <div className="ui-exploration__title-group">
          <h2 className="ui-exploration__heading">UI Exploration</h2>
          <p className="ui-exploration__subtitle">My playfulness around UIs</p>
        </div>
        <a href="#" className="ui-exploration__view-all">
          <span>View all</span>
          <ArrowUpRightIcon className="ui-exploration__arrow" />
        </a>
      </div>

      {/* Carousel wrapper */}
      <div
        className="ui-exploration__carousel"
        onMouseEnter={handleCarouselEnter}
        onMouseLeave={handleCarouselLeave}
      >
        {/* Floating sticker */}
        <div className={`ui-exploration__sticker${stickerVisible ? '' : ' ui-exploration__sticker--hidden'}`}>
          <span className="ui-exploration__sticker-hand">👆</span>
          <span className="ui-exploration__sticker-text">Hover on cards</span>
        </div>

        {/* Edge fades */}
        <div className="ui-exploration__fade ui-exploration__fade--left" />
        <div className="ui-exploration__fade ui-exploration__fade--right" />

        {/* Scrolling track */}
        <div className={`ui-exploration__track${paused ? ' ui-exploration__track--paused' : ''}`}>
          {allCards.map((card, i) => (
            <UICard key={`${card.id}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
