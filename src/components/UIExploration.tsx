import { useRef, useState } from 'react';
import pay4meImg from '../assets/images/pay4me-card.png';
import pay4meVideo from '../assets/videos/pay4me-demo.mp4';
import barakaImg from '../assets/images/baraka-card.jpg';
import barakaVideo from '../assets/videos/baraka-demo.mp4';
import './UIExploration.css';

/* ── Arrow icon ─────────────────────────────── */
function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Card data ──────────────────────────────── */
interface UICardData {
  id: number;
  title: string;
  subtitle: string;
  bg: string;
  accentColor: string;
  tag: string;
  /** Real image asset — shown idle */
  image?: string;
  /** Real video asset — plays on hover */
  video?: string;
}

const CARDS: UICardData[] = [
  {
    id: 1,
    title: 'Pay4Me Redesign',
    subtitle: 'The easiest and fastest way to pay tuition and fees to educational institutions worldwide.',
    bg: '#1B3A2D',
    accentColor: '#4ADE80',
    tag: 'Fintech',
    image: pay4meImg,
    video: pay4meVideo,
  },
  {
    id: 2,
    title: 'Baraka Landing Redesign',
    subtitle: 'Grow your wealth the smart way with auto-invest in US stocks & ETFs.',
    bg: '#0C0C14',
    accentColor: '#A78BFA',
    tag: 'Investing',
    image: barakaImg,
    video: barakaVideo,
  },
  {
    id: 3,
    title: 'Learnbeta Dashboard',
    subtitle: 'A reimagined learning experience that keeps students engaged and instructors in control.',
    bg: '#111827',
    accentColor: '#60A5FA',
    tag: 'EdTech',
  },
];

/* ── Browser chrome mock (cards without real assets) ── */
function BrowserMock({ accentColor, screenBg, isPlaying }: { accentColor: string; screenBg: string; isPlaying: boolean }) {
  return (
    <div className={`ui-card__browser${isPlaying ? ' ui-card__browser--playing' : ''}`} style={{ background: screenBg }}>
      <div className="ui-card__browser-bar">
        <span className="ui-card__dot" style={{ background: '#FF5F57' }} />
        <span className="ui-card__dot" style={{ background: '#FEBC2E' }} />
        <span className="ui-card__dot" style={{ background: '#28C840' }} />
        <div className="ui-card__url-bar"><span className="ui-card__url-text">app.design</span></div>
      </div>
      <div className="ui-card__mock-body">
        <div className="ui-card__mock-hero" style={{ background: `${accentColor}14` }}>
          <div className="ui-card__mock-line ui-card__mock-line--lg" style={{ background: accentColor }} />
          <div className="ui-card__mock-line ui-card__mock-line--md" style={{ background: `${accentColor}80` }} />
          <div className="ui-card__mock-line ui-card__mock-line--sm" style={{ background: `${accentColor}40` }} />
          <div className="ui-card__mock-btn" style={{ background: accentColor, color: screenBg }}>Get started</div>
        </div>
      </div>
      {isPlaying && (
        <div className="ui-card__play-badge">
          <span className="ui-card__sparkle-icon">✦</span>
          <span>Playing</span>
        </div>
      )}
    </div>
  );
}

/* ── Single card ─────────────────────────────── */
function UICard({ card }: { card: UICardData }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    setHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {/* autoplay blocked */});
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const hasRealAssets = Boolean(card.image || card.video);

  return (
    <div
      className={`ui-card${hovered ? ' ui-card--hovered' : ''}`}
      style={{ backgroundColor: card.bg }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {hasRealAssets ? (
        /* ── Real asset card (Pay4Me) ── */
        <>
          <div className="ui-card__media">
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                className={`ui-card__img${hovered && card.video ? ' ui-card__img--hidden' : ''}`}
              />
            )}
            {card.video && (
              <video
                ref={videoRef}
                src={card.video}
                muted
                loop
                playsInline
                className={`ui-card__video${hovered ? ' ui-card__video--visible' : ''}`}
              />
            )}
            {/* Playing badge */}
            {hovered && (
              <div className="ui-card__play-badge">
                <span className="ui-card__sparkle-icon">✦</span>
                <span>Playing</span>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Mock asset card (Baraka, Learnbeta) ── */
        <>
          <div className="ui-card__head">
            <span className="ui-card__tag" style={{ color: card.accentColor, borderColor: `${card.accentColor}40`, background: `${card.accentColor}12` }}>
              {card.tag}
            </span>
            <p className="ui-card__title">{card.title}</p>
            <p className="ui-card__subtitle">{card.subtitle}</p>
          </div>
          <div className="ui-card__screen">
            <BrowserMock
              accentColor={card.accentColor}
              screenBg={card.bg === '#0C0C14' ? '#1A1A2E' : '#0F1724'}
              isPlaying={hovered}
            />
          </div>
        </>
      )}

      {/* Hover lift glow */}
      <div className="ui-card__glow" style={{ background: `radial-gradient(ellipse at 50% 100%, ${card.accentColor}1A 0%, transparent 70%)` }} />
    </div>
  );
}

/* ── Section ─────────────────────────────────── */
export default function UIExploration() {
  const [paused, setPaused] = useState(false);
  const [stickerDone, setStickerDone] = useState(false);
  const stickerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    setPaused(true);
    if (!stickerDone) {
      if (stickerTimer.current) clearTimeout(stickerTimer.current);
      stickerTimer.current = setTimeout(() => setStickerDone(true), 500);
    }
  };

  // Duplicate cards for seamless infinite loop
  const allCards = [...CARDS, ...CARDS];

  return (
    <section className="ui-exploration">
      {/* Header animates in on scroll; carousel does NOT use data-animate to avoid transform conflicts */}
      <div className="ui-exploration__header" data-animate>
        <div className="ui-exploration__title-group">
          <h2 className="ui-exploration__heading">UI Exploration</h2>
          <p className="ui-exploration__subtitle">My playfulness around UIs</p>
        </div>
        <a href="#" className="ui-exploration__view-all">
          <span>View all</span>
          <ArrowUpRightIcon className="ui-exploration__arrow" />
        </a>
      </div>

      {/* Carousel — no data-animate to prevent transform glitch */}
      <div
        className="ui-exploration__carousel"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Floating sticker */}
        <div className={`ui-exploration__sticker${stickerDone ? ' ui-exploration__sticker--hidden' : ''}`}>
          <span className="ui-exploration__sticker-hand">👆</span>
          <span className="ui-exploration__sticker-text">Hover on cards</span>
        </div>

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
