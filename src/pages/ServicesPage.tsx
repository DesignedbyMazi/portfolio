import { useEffect, useRef, useState, type ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlareHover from '../components/GlareHover';
import websiteDesignVideo from '../assets/videos/website-design-demo.mp4';
import nocodeVideo        from '../assets/videos/nocode-demo.mp4';
import './ServicesPage.css';

/* ── Service data ───────────────────────────────────── */
interface Service {
  title: string;
  meta:  ReactNode;
  video?: string;
}

const SERVICES: Service[] = [
  { title: 'Website Design', meta: <>Product<br/>Designer</>,  video: websiteDesignVideo },
  { title: 'No-Code Dev',    meta: <>Framer<br/>Developer</>,  video: nocodeVideo        },
  { title: 'Graphics',       meta: <>In<br/>Progress</>                                  },
  { title: 'Brand Identity', meta: <>In<br/>Progress</>                                  },
];

/* Delay before the glare sweeps in — feels intentional, not jittery */
const GLARE_DELAY_MS = 480;

/* ── Props ──────────────────────────────────────────── */
interface ServicesPageProps {
  onBack:     () => void;
  onNavigate: (page: string) => void;
}

/* ── Page ───────────────────────────────────────────── */
export default function ServicesPage({ onBack, onNavigate }: ServicesPageProps) {
  const [activeIdx,     setActiveIdx]     = useState(0);
  const [hoveredIdx,    setHoveredIdx]    = useState<number | null>(null);
  const [glareTriggered, setGlareTriggered] = useState(false);
  const glareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Reset glare when the active service changes */
  useEffect(() => {
    clearGlareTimer();
    setGlareTriggered(false);
  }, [activeIdx]);

  /* Cleanup on unmount */
  useEffect(() => () => clearGlareTimer(), []);

  const clearGlareTimer = () => {
    if (glareTimer.current) {
      clearTimeout(glareTimer.current);
      glareTimer.current = null;
    }
  };

  const handleItemEnter = (i: number) => {
    setHoveredIdx(i);
    /* Only start the glare delay when hovering the ACTIVE item */
    if (i === activeIdx) {
      glareTimer.current = setTimeout(() => setGlareTriggered(true), GLARE_DELAY_MS);
    }
  };

  const handleItemLeave = () => {
    setHoveredIdx(null);
    clearGlareTimer();
    setGlareTriggered(false);
  };

  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
    else onNavigate(page);
  };

  return (
    <div className="svc-page">
      <Navbar activePage="Services" onNavigate={handleNav} />

      <div className="svc-content">

        {/* ── "Services I Offer" tag ─────────────────── */}
        <span className="svc-tag">Services I Offer</span>

        {/* ── Two-column body ───────────────────────── */}
        <div className="svc-body">

          {/* Left — service list */}
          <ul className="svc-list" role="list">
            {SERVICES.map((s, i) => {
              const isActive  = i === activeIdx;
              const isHovered = i === hoveredIdx;
              const metaShown = isActive || isHovered;

              return (
                <li
                  key={s.title}
                  className={`svc-item${isActive ? ' svc-item--active' : ''}`}
                  onMouseEnter={() => handleItemEnter(i)}
                  onMouseLeave={handleItemLeave}
                  onClick={() => setActiveIdx(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveIdx(i); }}
                  aria-pressed={isActive}
                >
                  {/* Glare sweeps across the title text only on the active item */}
                  <GlareHover
                    width="fit-content"
                    height="auto"
                    background="transparent"
                    borderRadius="0"
                    borderColor="transparent"
                    glareColor="#ffffff"
                    glareOpacity={0.5}
                    glareAngle={-30}
                    glareSize={280}
                    transitionDuration={800}
                    playOnce={false}
                    triggerGlare={isActive && glareTriggered}
                    className="svc-title-glare"
                  >
                    <span className="svc-title">{s.title}</span>
                  </GlareHover>

                  <span
                    className="svc-meta"
                    aria-hidden={!metaShown}
                    style={{ opacity: metaShown ? 1 : 0 }}
                  >
                    {s.meta}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Right — visual panel */}
          <div className="svc-visual" aria-hidden="true">

            {/* Top doodles */}
            <svg className="svc-doodle svc-doodle--top" viewBox="0 0 430 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {/* Dot cluster — top left */}
              <circle cx="28"  cy="22" r="3"   fill="currentColor" opacity=".45"/>
              <circle cx="46"  cy="12" r="1.8" fill="currentColor" opacity=".28"/>
              <circle cx="60"  cy="34" r="1.2" fill="currentColor" opacity=".35"/>
              <circle cx="18"  cy="42" r="1.5" fill="currentColor" opacity=".22"/>
              {/* 4-point sparkle */}
              <path d="M96 16 L98 22 L104 24 L98 26 L96 32 L94 26 L88 24 L94 22 Z" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".42"/>
              {/* Dashed divider line */}
              <line x1="68" y1="55" x2="136" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity=".3"/>
              {/* Mini browser wireframe */}
              <rect x="158" y="14" width="52" height="38" rx="4" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".38"/>
              <line x1="158" y1="24" x2="210" y2="24" stroke="currentColor" strokeWidth="1" opacity=".28"/>
              <circle cx="164" cy="19" r="1.6" fill="currentColor" opacity=".38"/>
              <circle cx="170" cy="19" r="1.6" fill="currentColor" opacity=".38"/>
              <circle cx="176" cy="19" r="1.6" fill="currentColor" opacity=".38"/>
              <rect x="164" y="30" width="26" height="4" rx="2" fill="currentColor" opacity=".18"/>
              <rect x="164" y="38" width="18" height="4" rx="2" fill="currentColor" opacity=".12"/>
              {/* Plus cross */}
              <line x1="262" y1="18" x2="262" y2="36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".38"/>
              <line x1="253" y1="27" x2="271" y2="27" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".38"/>
              {/* Curved arrow hint */}
              <path d="M296 56 Q316 32 338 46" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".3"/>
              <path d="M334 40 L340 47 L331 49" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity=".3"/>
              {/* Right scatter */}
              <circle cx="370" cy="18" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".35"/>
              <circle cx="392" cy="34" r="2"   fill="currentColor" opacity=".28"/>
              <circle cx="410" cy="16" r="1.5" fill="currentColor" opacity=".45"/>
              {/* Small star right */}
              <path d="M404 54 L405.2 58.4 L409.8 58.4 L406.2 61.1 L407.5 65.5 L404 62.9 L400.5 65.5 L401.8 61.1 L398.2 58.4 L402.8 58.4 Z" fill="currentColor" opacity=".32"/>
            </svg>

            {/* Video */}
            {SERVICES[activeIdx].video && (
              <video
                key={SERVICES[activeIdx].title}
                ref={(el) => { el?.play().catch(() => {}); }}
                src={SERVICES[activeIdx].video}
                muted
                loop
                playsInline
                preload="none"
                className="svc-visual__video"
              />
            )}

            {/* Bottom doodles */}
            <svg className="svc-doodle svc-doodle--bottom" viewBox="0 0 430 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {/* 3×4 dot grid — bottom left */}
              {[0,1,2,3].map(col => [0,1,2].map(row => (
                <circle key={`${col}-${row}`} cx={22 + col * 12} cy={20 + row * 12} r="1.8" fill="currentColor" opacity=".3"/>
              )))}
              {/* Wavy bezier line — center */}
              <path d="M90 44 Q110 24 130 44 Q150 64 170 44" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".35"/>
              {/* Small outlined square */}
              <rect x="198" y="20" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".38"/>
              {/* Small outlined triangle */}
              <polygon points="246,62 258,40 270,62" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" opacity=".35"/>
              {/* Dotted arc */}
              <path d="M296 66 Q316 30 346 56" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" opacity=".28"/>
              {/* Right floating circles */}
              <circle cx="374" cy="30" r="6"   fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".35"/>
              <circle cx="374" cy="30" r="2"   fill="currentColor" opacity=".3"/>
              <circle cx="394" cy="52" r="2.5" fill="currentColor" opacity=".25"/>
              <circle cx="410" cy="38" r="1.5" fill="currentColor" opacity=".4"/>
              <circle cx="402" cy="20" r="1.2" fill="currentColor" opacity=".3"/>
              {/* Bracket-like code hint */}
              <path d="M310 22 L304 28 L310 34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".32"/>
              <path d="M322 22 L328 28 L322 34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".32"/>
            </svg>

          </div>

        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <div className="svc-footer-wrap">
        <Footer />
      </div>
    </div>
  );
}
