import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ServicesPage.css';

/* ── Service data ───────────────────────────────────── */
interface Service {
  title: string;
  meta:  string;
}

const SERVICES: Service[] = [
  { title: 'Website Design', meta: 'Product Designer'  },
  { title: 'No-Code Dev',    meta: 'Framer Developer'  },
  { title: 'Graphics',       meta: 'In Progress'       },
  { title: 'Brand Identity', meta: 'In Progress'       },
];

/* ── Props ──────────────────────────────────────────── */
interface ServicesPageProps {
  onBack:     () => void;
  onNavigate: (page: string) => void;
}

/* ── Page ───────────────────────────────────────────── */
export default function ServicesPage({ onBack, onNavigate }: ServicesPageProps) {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setActiveIdx(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveIdx(i); }}
                  aria-pressed={isActive}
                >
                  <span className="svc-title">{s.title}</span>
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

          {/* Right — image placeholder */}
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
