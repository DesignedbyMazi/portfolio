import { useCallback, useEffect, useRef, useState } from 'react';
import pay4meImg       from '../assets/images/pay4me-card.png';
import pay4meVideo     from '../assets/videos/pay4me-demo.mp4';
import barakaImg       from '../assets/images/baraka-card.jpg';
import barakaVideo     from '../assets/videos/baraka-demo.mp4';
import dashboardImg    from '../assets/images/dashboard-card.png';
import dashboardVideo  from '../assets/videos/dashboard-demo.mp4';
import balanceeImg     from '../assets/images/balancee-card.png';
import balanceeVideo   from '../assets/videos/balancee-demo.mp4';
import karsaImg        from '../assets/images/karsa-card.png';
import './UIExploration.css';

/* ── Touch detection ─────────────────────────────────── */
function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/* ── Card data ──────────────────────────────────────── */
interface UICardData {
  id:          number;
  title:       string;
  subtitle:    string;
  bg:          string;
  accentColor: string;
  tag:         string;
  image?:      string;
  video?:      string;
}

const CARDS: UICardData[] = [
  { id:1, title:'Pay4Me Redesign',              subtitle:'The easiest and fastest way to pay tuition and fees to educational institutions worldwide.',     bg:'#1B3A2D', accentColor:'#4ADE80', tag:'Fintech',     image:pay4meImg,      video:pay4meVideo    },
  { id:2, title:'Baraka Landing Redesign',      subtitle:'Grow your wealth the smart way with auto-invest in US stocks & ETFs.',                          bg:'#0C0C14', accentColor:'#A78BFA', tag:'Investing',   image:barakaImg,      video:barakaVideo    },
  { id:3, title:'Project Management Dashboard', subtitle:'Designed for efficiency, the dashboard effectively highlights crucial project data.',             bg:'#1E2A78', accentColor:'#818CF8', tag:'Productivity', image:dashboardImg,  video:dashboardVideo },
  { id:4, title:'Balanceé Feature',             subtitle:'Streamlined Vehicle Repair and Maintenance Services with customer-focused features.',             bg:'#0D7C7C', accentColor:'#5EEAD4', tag:'FinTech',     image:balanceeImg,    video:balanceeVideo  },
  { id:6, title:'Karsa — Spend Anywhere',       subtitle:'Transfer money globally with ease. Additional support for US transfers.',                        bg:'#111111', accentColor:'#6EE7B7', tag:'Finance',     image:karsaImg                            },
];

/* ── Scroll speed (px per 60fps frame ≈ 30 px/s) ───── */
const SCROLL_SPEED = 0.5;

/* ── Browser chrome mock ─────────────────────────────── */
function BrowserMock({
  accentColor,
  screenBg,
  isPlaying,
}: {
  accentColor: string;
  screenBg:    string;
  isPlaying:   boolean;
}) {
  return (
    <div
      className={`ui-card__browser${isPlaying ? ' ui-card__browser--playing' : ''}`}
      style={{ background: screenBg }}
    >
      <div className="ui-card__browser-bar">
        <span className="ui-card__dot" style={{ background: '#FF5F57' }} />
        <span className="ui-card__dot" style={{ background: '#FEBC2E' }} />
        <span className="ui-card__dot" style={{ background: '#28C840' }} />
        <div className="ui-card__url-bar">
          <span className="ui-card__url-text">app.design</span>
        </div>
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

/* ── Video focus overlay ─────────────────────────────── */
function VideoOverlay({
  card,
  onDismiss,
}: {
  card:      UICardData;
  onDismiss: () => void;
}) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const dismissed = useRef(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setLeaving(true);
    setTimeout(onDismiss, 190);
  }, [onDismiss]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => dismiss();
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismiss]);

  if (!card.video) return null;

  return (
    <div
      className={`ui-overlay${leaving ? ' ui-overlay--leaving' : ''}`}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing: ${card.title}`}
    >
      <div
        className={`ui-overlay__card${leaving ? ' ui-overlay__card--leaving' : ''}`}
        style={{ background: card.bg }}
        onClick={e => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={card.video}
          muted
          playsInline
          preload="metadata"
          className="ui-overlay__video"
          onEnded={dismiss}
        />
        <div className="ui-overlay__info">
          <p className="ui-overlay__title">{card.title}</p>
          <p className="ui-overlay__subtitle">{card.subtitle}</p>
        </div>
      </div>

      <p className="ui-overlay__hint">Click anywhere to close</p>
    </div>
  );
}

/* ── Single carousel card ────────────────────────────── */
function UICard({
  card,
  onFocusCard,
  isDragging,
}: {
  card:        UICardData;
  onFocusCard: (card: UICardData) => void;
  isDragging:  () => boolean;
}) {
  const [hovered, setHovered] = useState(false);

  /*
   * DESKTOP — mouseenter opens overlay immediately, but only
   * when the user isn't mid-drag (moved > 6px threshold).
   */
  /* Hover scales the card and pauses the carousel — overlay never opens on hover */
  const handleEnter = () => {
    if (!card.video || isTouchDevice()) return;
    setHovered(true);
  };

  const handleLeave = () => {
    if (!card.video || isTouchDevice()) return;
    setHovered(false);
  };

  /* Click / tap opens the overlay on all devices. Guard drag so swipe-release doesn't fire. */
  const handleClick = () => {
    if (card.video && !isDragging()) onFocusCard(card);
  };

  const hasRealAssets = Boolean(card.image || card.video);

  return (
    <div
      className={`ui-card${hovered ? ' ui-card--hovered' : ''}`}
      style={{
        backgroundColor: card.bg,
        cursor: card.video ? 'pointer' : 'inherit',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {hasRealAssets ? (
        <div className="ui-card__media">
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              decoding="async"
              className="ui-card__img"
            />
          )}
        </div>
      ) : (
        <>
          <div className="ui-card__head">
            <span
              className="ui-card__tag"
              style={{
                color:        card.accentColor,
                borderColor:  `${card.accentColor}40`,
                background:   `${card.accentColor}12`,
              }}
            >
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
      <div
        className="ui-card__glow"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${card.accentColor}1A 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

/* ── Section ─────────────────────────────────────────── */
export default function UIExploration() {
  const [mouseOver,   setMouseOver]   = useState(false);
  const [focusedCard, setFocusedCard] = useState<UICardData | null>(null);

  const trackRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);          /* current scroll offset in px  */
  const rafRef    = useRef<number>(0);  /* rAF handle for cleanup       */
  const pausedRef = useRef(false);      /* mirrors `paused` for the rAF */

  /* drag: { startX, startPos (px at drag start), moved } */
  const dragRef = useRef<{
    startX:   number;
    startPos: number;
    moved:    boolean;
  } | null>(null);

  /* Keep ref in sync — rAF reads pausedRef to avoid stale closures */
  const paused = mouseOver || focusedCard !== null;
  pausedRef.current = paused;

  /* ── rAF scroll loop — runs for the lifetime of the component ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const step = () => {
      /* Advance only when unpaused and not dragging */
      if (!pausedRef.current && !dragRef.current) {
        posRef.current += SCROLL_SPEED;
      }

      /* Infinite wrap: track is 2× cards, wrap at the midpoint */
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (posRef.current >= half) posRef.current -= half;
        if (posRef.current <  0)   posRef.current += half;
      }

      track.style.transform = `translateX(${-posRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); /* empty — refs keep everything up-to-date without restarts */

  /* ── Drag pointer handlers (desktop only) ─────────── */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return;
    dragRef.current = { startX: e.clientX, startPos: posRef.current, moved: false };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 6) dragRef.current.moved = true;
    /* Drag right → negative delta → scroll left (smaller pos) */
    posRef.current = dragRef.current.startPos - delta;
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleFocusCard = useCallback((card: UICardData) => {
    setFocusedCard(card);
  }, []);

  const handleDismissOverlay = useCallback(() => {
    setFocusedCard(null);
  }, []);

  /* Pause carousel while mouse hovers over the strip */
  const handleCarouselEnter = () => {
    if (!isTouchDevice()) setMouseOver(true);
  };
  const handleCarouselLeave = () => {
    if (!isTouchDevice()) {
      setMouseOver(false);
      dragRef.current = null; /* cancel any drag that exits the bounds */
    }
  };

  /* Passed down so hover-to-open is suppressed during a drag */
  const isDragging = useCallback(() => dragRef.current?.moved ?? false, []);

  const allCards = [...CARDS, ...CARDS];

  return (
    <section className="ui-exploration">

      {focusedCard && (
        <VideoOverlay card={focusedCard} onDismiss={handleDismissOverlay} />
      )}

      <div
        className="ui-exploration__carousel"
        onMouseEnter={handleCarouselEnter}
        onMouseLeave={handleCarouselLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={trackRef} className="ui-exploration__track">
          {allCards.map((card, i) => (
            <UICard
              key={`${card.id}-${i}`}
              card={card}
              onFocusCard={handleFocusCard}
              isDragging={isDragging}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
