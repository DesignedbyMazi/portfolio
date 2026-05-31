import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ── Images ─────────────────────────────────────────── */
import carloftyImg    from '../assets/images/carlofty-case-study.png';
import pay4meImg      from '../assets/images/pay4me-card.png';
import dashboardImg   from '../assets/images/dashboard-card.png';
import balanceeImg    from '../assets/images/balancee-card.png';
import barakaImg      from '../assets/images/baraka-card.jpg';
import karsaImg       from '../assets/images/karsa-card.png';
import cryptoImg      from '../assets/images/crypto-wallet-card.png';

/* ── Videos ─────────────────────────────────────────── */
import carloftyVideo  from '../assets/videos/carlofty-outcome.mp4';
import pay4meVideo    from '../assets/videos/pay4me-demo.mp4';
import dashboardVideo from '../assets/videos/dashboard-demo.mp4';
import balanceeVideo  from '../assets/videos/balancee-demo.mp4';
import barakaVideo    from '../assets/videos/baraka-demo.mp4';

import './WorksPage.css';

/* ── Icons ──────────────────────────────────────────── */
function ArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <rect x="1.5" y="5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────── */
type Tab = 'live' | 'cases';

interface LiveProject {
  id:     string;
  title:  string;
  image:  string;
  video?: string;
  href?:  string;
}

interface CaseStudy {
  id:          string;
  image:       string;
  title:       string;
  description: string;
  video?:      string;
  comingSoon?: boolean;
}

const liveProjects: LiveProject[] = [
  { id: 'carlofty',   title: 'Carlofty',      image: carloftyImg,  video: carloftyVideo,  href: 'https://www.carlofty.com/' },
  { id: 'pay4me',     title: 'Pay4Me',        image: pay4meImg,    video: pay4meVideo    },
  { id: 'dashboard',  title: 'Dashboard',     image: dashboardImg, video: dashboardVideo },
  { id: 'balancee',   title: 'Balancee',      image: balanceeImg,  video: balanceeVideo  },
  { id: 'baraka',     title: 'Baraka',        image: barakaImg,    video: barakaVideo,   href: 'https://barakaredesign.framer.website/' },
  { id: 'karsa',      title: 'Karsa',         image: karsaImg                           },
  { id: 'crypto',     title: 'Crypto Wallet', image: cryptoImg                          },
];

const caseStudies: CaseStudy[] = [
  {
    id: 'carlofty',
    video: carloftyVideo,
    image: carloftyImg,
    title:
      'Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing.',
    description:
      "Global car auctions shouldn't require a middleman. Carlofty was designed to give " +
      "Nigerian buyers direct, transparent access to Copart, Manheim, and IAAI — from a " +
      "single platform they could actually trust.",
  },
  {
    id: 'coming-soon',
    image: dashboardImg,
    title: 'Next case study in progress.',
    description:
      "A detailed breakdown of another end-to-end product design engagement. " +
      "Currently being documented — check back soon.",
    comingSoon: true,
  },
];

/* ── Case study card — handles hover video on the image ─ */
function CaseCard({
  cs,
  onReadCaseStudy,
}: {
  cs: CaseStudy;
  onReadCaseStudy: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    if (!cs.video) return;
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    if (!cs.video) return;
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

  return (
    <div className={`works-case${cs.comingSoon ? ' works-case--locked' : ''}`}>
      {cs.comingSoon && (
        <p className="works-coming-soon">
          <span>Coming soon</span>
          <LockIcon />
        </p>
      )}

      {/* Image / video frame */}
      <div
        className="works-case-img-wrap"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <img
          src={cs.image}
          alt={cs.title}
          className={`works-case-img${hovered ? ' works-case-img--hidden' : ''}`}
        />
        {cs.video && (
          <video
            ref={videoRef}
            src={cs.video}
            className={`works-case-video${hovered ? ' works-case-video--visible' : ''}`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
      </div>

      <div className="works-case-body">
        <h3 className="works-case-title">{cs.title}</h3>
        <p className="works-case-desc">{cs.description}</p>
        <span
          className="works-case-cta"
          role={cs.comingSoon ? undefined : 'button'}
          tabIndex={cs.comingSoon ? -1 : 0}
          onClick={cs.comingSoon ? undefined : onReadCaseStudy}
          onKeyDown={(e) => {
            if (!cs.comingSoon && (e.key === 'Enter' || e.key === ' ')) onReadCaseStudy();
          }}
        >
          <span>Read Case Study</span>
          <ArrowUpRight />
        </span>
      </div>
    </div>
  );
}

/* ── Grid card — handles hover video playback ────────── */
function GridCard({ project }: { project: LiveProject }) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

  const handleClick = () => {
    if (project.href) window.open(project.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`works-grid-card${hovered ? ' works-grid-card--hovered' : ''}${project.href ? ' works-grid-card--link' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      role={project.href ? 'link' : undefined}
      tabIndex={project.href ? 0 : undefined}
      onKeyDown={(e) => { if (project.href && (e.key === 'Enter' || e.key === ' ')) handleClick(); }}
      aria-label={project.href ? `Visit ${project.title}` : project.title}
    >
      <img
        src={project.image}
        alt={project.title}
        className="works-grid-img"
      />
      {project.video && (
        <video
          ref={videoRef}
          src={project.video}
          className="works-grid-video"
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}

/* ── Props ──────────────────────────────────────────── */
interface WorksPageProps {
  onBack:          () => void;
  onReadCaseStudy: () => void;
  onNavigate:      (page: string) => void;
}

/* ── Page ───────────────────────────────────────────── */
export default function WorksPage({ onBack, onReadCaseStudy, onNavigate }: WorksPageProps) {
  const [tab, setTab] = useState<Tab>('live');

  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
    else onNavigate(page);
  };

  return (
    <div className="works-page">
      <Navbar activePage="Work" onNavigate={handleNav} />

      <div className="works-content">

        {/* ── Toggle ──────────────────────────────────── */}
        <div className="works-toggle-row">
          <div className="works-toggle" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'live'}
              className={`works-tab${tab === 'live' ? ' works-tab--active' : ''}`}
              onClick={() => setTab('live')}
            >
              Live/Exploration Projects
            </button>
            <button
              role="tab"
              aria-selected={tab === 'cases'}
              className={`works-tab${tab === 'cases' ? ' works-tab--active' : ''}`}
              onClick={() => setTab('cases')}
            >
              Case Studies
            </button>
          </div>
        </div>

        {/* ── Live / Exploration grid ──────────────────── */}
        {tab === 'live' && (
          <div className="works-grid" role="tabpanel">
            {liveProjects.map((p) => (
              <GridCard key={p.id} project={p} />
            ))}
          </div>
        )}

        {/* ── Case studies list ────────────────────────── */}
        {tab === 'cases' && (
          <div className="works-cases" role="tabpanel">
            {caseStudies.map((cs) => (
              <CaseCard key={cs.id} cs={cs} onReadCaseStudy={onReadCaseStudy} />
            ))}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────── */}
        <div className="works-footer-wrap">
          <Footer />
        </div>

      </div>
    </div>
  );
}
