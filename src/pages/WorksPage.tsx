import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carloftyImg    from '../assets/images/carlofty-case-study.png';
import pay4meImg      from '../assets/images/pay4me-card.png';
import dashboardImg   from '../assets/images/dashboard-card.png';
import balanceeImg    from '../assets/images/balancee-card.png';
import barakaImg      from '../assets/images/baraka-card.jpg';
import karsaImg       from '../assets/images/karsa-card.png';
import cryptoImg      from '../assets/images/crypto-wallet-card.png';
import './WorksPage.css';

/* ── Icons ─────────────────────────────────────────────── */
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

/* ── Data ───────────────────────────────────────────────── */
type Tab = 'live' | 'cases';

interface LiveProject {
  id:    string;
  title: string;
  image: string;
}

interface CaseStudy {
  id:          string;
  image:       string;
  title:       string;
  description: string;
  comingSoon?: boolean;
}

const liveProjects: LiveProject[] = [
  { id: 'carlofty',   title: 'Carlofty',             image: carloftyImg  },
  { id: 'pay4me',     title: 'Pay4Me',               image: pay4meImg    },
  { id: 'dashboard',  title: 'Dashboard',            image: dashboardImg },
  { id: 'balancee',   title: 'Balancee',             image: balanceeImg  },
  { id: 'baraka',     title: 'Baraka',               image: barakaImg    },
  { id: 'karsa',      title: 'Karsa',                image: karsaImg     },
  { id: 'crypto',     title: 'Crypto Wallet',        image: cryptoImg    },
];

const caseStudies: CaseStudy[] = [
  {
    id: 'carlofty',
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

/* ── Props ──────────────────────────────────────────────── */
interface WorksPageProps {
  onBack:          () => void;
  onReadCaseStudy: () => void;
  onNavigate:      (page: string) => void;
}

/* ── Page ───────────────────────────────────────────────── */
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

        {/* ── Toggle ──────────────────────────────────────── */}
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

        {/* ── Live / Exploration grid ──────────────────────── */}
        {tab === 'live' && (
          <div className="works-grid" role="tabpanel">
            {liveProjects.map((p) => (
              <div key={p.id} className="works-grid-card">
                <img src={p.image} alt={p.title} className="works-grid-img" />
              </div>
            ))}
          </div>
        )}

        {/* ── Case studies list ────────────────────────────── */}
        {tab === 'cases' && (
          <div className="works-cases" role="tabpanel">
            {caseStudies.map((cs) => (
              <div
                key={cs.id}
                className={`works-case${cs.comingSoon ? ' works-case--locked' : ''}`}
              >
                {cs.comingSoon && (
                  <p className="works-coming-soon">
                    <span>Coming soon</span>
                    <LockIcon />
                  </p>
                )}

                <div className="works-case-img-wrap">
                  <img src={cs.image} alt={cs.title} className="works-case-img" />
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
            ))}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────── */}
        <div className="works-footer-wrap">
          <Footer />
        </div>

      </div>
    </div>
  );
}
