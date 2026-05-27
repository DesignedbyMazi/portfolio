import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import carloftyHeroImg from '../assets/images/carlofty-landing.png';
import carloftyDashboardImg from '../assets/images/carlofty-dashboard.png';
import carloftyRoleVideo from '../assets/videos/carlofty-role.mp4';
import carloftyWaitlistVideo from '../assets/videos/carlofty-waitlist.mp4';
import './CarloftyCaseStudy.css';

interface Props {
  onBack: () => void;
}

/* ── Auto-play video when in view ─────────────────── */
function VideoInView({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      className={className}
    />
  );
}

/* ── Scroll-reveal wrapper ────────────────────────── */
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('cs-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -24px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`cs-reveal${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

/* ── Eyebrow label ────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  const parts = text.split(' — ');
  return (
    <p className="cs-eyebrow">
      {parts[0]}
      {parts[1] && (
        <>
          {' — '}
          <span className="cs-eyebrow__brand">{parts[1]}</span>
        </>
      )}
    </p>
  );
}

/* ── Ban icon ─────────────────────────────────────── */
function BanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="cs-ban-icon">
      <circle cx="8" cy="8" r="6.5" stroke="#E53935" strokeWidth="1.5" />
      <line x1="3.5" y1="12.5" x2="12.5" y2="3.5" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Main component ───────────────────────────────── */
export default function CarloftyCaseStudy({ onBack }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="cs-page">
      <Navbar activePage="Work" />

      <div className="cs-content">

        {/* ── Go back ───────────────────────────────── */}
        <div className="cs-back-row">
          <button className="cs-back-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11.5L4.5 7L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go back
          </button>
        </div>

        {/* ── Hero ──────────────────────────────────── */}
        <Reveal className="cs-hero">
          <p className="cs-breadcrumb">
            Case study — <span className="cs-breadcrumb__brand">Carlofty</span>
          </p>
          <h1 className="cs-hero__title">
            Designing Trust into a Broken Payment Experience For Cross-Border Car Sourcing
          </h1>
          <p className="cs-hero__overview">
            How I established design direction, built a product from v1, and helped facilitate
            thousands of dollars in auction transactions — including a record 10-minute Copart
            payment.
          </p>

          {/* 2×2 meta grid */}
          <div className="cs-meta-grid">
            <div className="cs-meta-cell">
              <span className="cs-meta-label">Year</span>
              <span className="cs-meta-value">2026</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--border-left">
              <span className="cs-meta-label">My Role</span>
              <span className="cs-meta-value">Lead Product Designer</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--border-top">
              <span className="cs-meta-label">Team</span>
              <span className="cs-meta-value">1 Designer, 1 PM, 3 Engineers</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--border-top cs-meta-cell--border-left">
              <span className="cs-meta-label">Deliverables</span>
              <span className="cs-meta-value">
                Design system, Auction Flow, Payment Flow, Admin Dashboard, Dealer + Buyer
                Experience.
              </span>
            </div>
          </div>
        </Reveal>

        {/* ── Hero image ────────────────────────────── */}
        <Reveal>
          <img src={carloftyHeroImg} alt="Carlofty landing page" className="cs-img" />
        </Reveal>

        {/* ── MY ROLE ───────────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="MY ROLE — Carlofty" />
          <h2 className="cs-heading">Lead Product Designer</h2>
          <p className="cs-body">
            I was responsible for design direction, system, flows, and handoff. I worked directly
            with the PM and engineers to translate user pain and business goals into a product that
            actually worked.
          </p>
          <div className="cs-tags">
            {['UX Research', 'Competitor Analysis', 'Design System', 'User Flows', 'Prototyping', 'Dev Handoff'].map((t) => (
              <span key={t} className="cs-tag">{t}</span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <VideoInView src={carloftyRoleVideo} className="cs-img cs-img--video" />
        </Reveal>

        {/* ── THE CHALLENGE ─────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="THE CHALLENGE — Carlofty" />
          <h2 className="cs-heading">Trust Was The Missing Feature.</h2>
          <p className="cs-body">
            Sourcing cars from foreign auctions is common practice for Nigerian dealers and buyers.
            The barrier isn't knowledge — it's infrastructure. You cannot pay Copart, Manheim, or
            IAAI directly in Naira, from Nigeria, in your own name.
          </p>
          <p className="cs-body">
            That gap created a broker economy with no accountability. Money changed hands
            informally. Tracking didn't exist. And when things went wrong, there was no recourse.
          </p>
          <div className="cs-callout cs-callout--red">
            <p className="cs-callout__text">You sent money. Then you waited. And hoped.</p>
          </div>
          <p className="cs-body">
            The v1 product existed but had no clear direction — inconsistent components, undefined
            flows, and no structured path through the core transaction. Both dealers and buyers were
            underserved.
          </p>
          <div className="cs-ban-list">
            {[
              ['No Direct Payment Path', "Naira couldn’t reach foreign auctions without a middleman"],
              ['Broker Exploitation', 'Hidden fees, no accountability, money lost with no recourse'],
              ['Zero Tracking', 'Once funds left the customer, visibility ended completely'],
              ['No Design Foundation', 'Inconsistent v1 with no system, no flows, no direction'],
            ].map(([bold, rest]) => (
              <div key={bold} className="cs-ban-item">
                <BanIcon />
                <p className="cs-ban-item__text">
                  <strong>{bold}</strong> — {rest}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <img src={carloftyDashboardImg} alt="Carlofty dealer dashboard" className="cs-img" />
        </Reveal>

        {/* ── RESEARCH ──────────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="RESEARCH — Carlofty" />
          <h2 className="cs-heading">Understanding The Problem Before Opening Figma</h2>
          <p className="cs-body">
            I ran three layers of research before touching any UI — competitor analysis, user
            interviews with dealers and buyers, and a full product audit. Due to an NDA, specific
            findings are kept at the level of insight rather than detail.
          </p>
        </Reveal>

        {/* ── 1. COMPETITOR ANALYSIS ────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="1. COMPETITOR ANALYSIS — Carlofty" />
          <h2 className="cs-heading">Three Platforms. Three Different Approach. One Clear Gap.</h2>
          <p className="cs-body">
            I mapped Carlofty against existing players in the cross-border vehicle sourcing space
            — looking at target audience, inventory quality, financing models, and core
            differentiation.
          </p>
          <div className="cs-what-found">
            <p className="cs-what-found__label">WHAT I FOUND</p>
            <p className="cs-what-found__body">
              Competitors either served individual buyers with mixed-quality inventory, or importers
              working with salvage cars. None were serving professional dealers with a quality
              guarantee and financing infrastructure. That gap was Carlofty's advantage — and the
              design had to make it legible at every touchpoint.
            </p>
          </div>
        </Reveal>

        {/* ── 2. USER RESEARCH ──────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="2. USER RESEARCH — Carlofty" />
          <h2 className="cs-heading">Dealers Knew What They Needed. The Product Wasn't Delivering It.</h2>
          <p className="cs-body">
            I mapped the needs, goals, and frustrations of both dealers and buyers through user
            stories and pain point analysis. Three consistent themes emerged across both user types.
          </p>
          <div className="cs-findings">
            {[
              {
                num: '01',
                title: 'Visibility was missing',
                body: 'Users needed to see what was happening at every stage — auction activity, payment status, order progress. The v1 gave them almost none of this. Decisions were being made without inclusion.',
              },
              {
                num: '02',
                title: 'Trust had to be earned through the UI',
                body: "Sending significant money to a platform for a car they hadn't physically seen required a level of confidence the product wasn't building. Every unclear step eroded that confidence further.",
              },
              {
                num: '03',
                title: 'Complexity was being dumped on the user',
                body: "The backend process of cross-border payment and sourcing is genuinely complex. Users didn't need to understand all of it — they needed the product to absorb that complexity and surface only what mattered.",
              },
            ].map((f) => (
              <div key={f.num} className="cs-finding">
                <span className="cs-finding__num">{f.num}</span>
                <div className="cs-finding__body">
                  <strong className="cs-finding__title">{f.title}</strong>
                  <p className="cs-finding__text">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cs-callout cs-callout--red">
            <p className="cs-callout__text">
              Money moved. Nothing else did. That one insight shaped every design decision that
              followed.
            </p>
          </div>
        </Reveal>

        {/* ── 3. PRODUCT AUDIT ──────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="3. PRODUCT AUDIT — Carlofty" />
          <h2 className="cs-heading">The 4-Step Email Incident: Friction At Every Step.</h2>
          <p className="cs-body">
            The v1 onboarding required dealers to complete a 4-step email verification sequence
            before accessing any part of the product. By the time they reached the dashboard, many
            had already lost confidence.
          </p>
          <p className="cs-body">
            This wasn't a feature — it was attrition by design. Each extra step was a moment where
            a dealer asked themselves whether this was worth it.
          </p>
          <div className="cs-steps">
            {[
              'Sign up form — email, password, phone',
              'Verify email — check inbox, click link',
              'Complete profile — business info, documents',
              'Wait for admin approval — no ETA given',
            ].map((step, i) => (
              <div key={i} className="cs-step">
                <span className="cs-step__num">Step {i + 1}</span>
                <span className="cs-step__text">{step}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── EXECUTION ─────────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="EXECUTION — Carlofty" />
          <h2 className="cs-heading">My Waitlist Landing Page Redesign.</h2>
          <p className="cs-body">
            Before rebuilding the product, I redesigned the marketing site. The goal was to convert
            skeptical dealers from the first scroll — using social proof, transparent pricing, and
            a frictionless sign-up that felt like a handshake, not a gate.
          </p>
        </Reveal>

        <Reveal>
          <VideoInView src={carloftyWaitlistVideo} className="cs-img cs-img--video" />
        </Reveal>

        {/* ── IMPACT ────────────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="IMPACT — Carlofty" />
          <h2 className="cs-heading">The Numbers Show It.</h2>
          <p className="cs-body">
            The redesigned platform launched to early dealers and began scaling deal volume month
            over month. Onboarding completion increased, dealer confusion support tickets dropped.
          </p>
          <div className="cs-stats">
            {[
              { value: '$9M+', label: 'In deals completed' },
              { value: '200+', label: 'Accessible auctions' },
              { value: '498k+', label: 'Available cars' },
              { value: '70%', label: 'Faster time-to-value' },
            ].map((s) => (
              <div key={s.value} className="cs-stat">
                <span className="cs-stat__value">{s.value}</span>
                <span className="cs-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <img src={carloftyHeroImg} alt="Carlofty final design" className="cs-img" />
        </Reveal>

        {/* ── Footer ────────────────────────────────── */}
        <footer className="cs-footer">
          <p className="cs-footer__text">designedbyuche@gmail.com</p>
          <button className="cs-back-btn" onClick={onBack}>
            ← Back to portfolio
          </button>
        </footer>

      </div>
    </div>
  );
}
