import { useEffect, useRef, useState, type ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlareHover from '../components/GlareHover';
import './ServicesPage.css';

/* ── Service data ───────────────────────────────────── */
interface Service {
  title: string;
  meta:  ReactNode;
}

const SERVICES: Service[] = [
  { title: 'Website Design', meta: <>Product<br/>Designer</>  },
  { title: 'No-Code Dev',    meta: <>Framer<br/>Developer</>  },
  { title: 'Graphics',       meta: <>In<br/>Progress</>       },
  { title: 'Brand Identity', meta: <>In<br/>Progress</>       },
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

          {/* Right — plain container, will carry a video */}
          <div className="svc-visual" aria-hidden="true" />

        </div>
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <div className="svc-footer-wrap">
        <Footer />
      </div>
    </div>
  );
}
