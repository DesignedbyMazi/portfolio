import { useEffect, useRef, useState } from 'react';
import {
  Stack, DeviceMobile, CreditCard, Browsers, UserMinus,
  TrendUp, Lightning, Package, ShieldCheck,
} from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import carloftyHeroImg from '../assets/images/carlofty-landing.png';
import carloftyDashboardImg from '../assets/images/carlofty-dashboard.png';
import carloftyChallengeImg from '../assets/images/carlofty-challenge.png';
import carloftyRoleVideo from '../assets/videos/carlofty-role.mp4';
import carloftyDesignSystemVideo from '../assets/videos/carlofty-design-system.mp4';
import carloftyWaitlistVideo from '../assets/videos/carlofty-waitlist.mp4';
import carloftyOutcomeVideo from '../assets/videos/carlofty-outcome.mp4';
import './CarloftyCaseStudy.css';

interface Props { onBack: () => void; }

/* ── Custom eased scroll to top ──────────────────── */
function scrollToTopSmooth() {
  const start = window.scrollY;
  const duration = 900;
  const startTime = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start * (1 - ease(t)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ── Auto-play video on scroll into view ─────────── */
function VideoInView({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? video.play().catch(() => {}) : video.pause(); },
      { threshold: 0.25 },
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, []);
  return <video ref={ref} src={src} muted loop playsInline className={className} />;
}

/* ── One-shot scroll reveal ──────────────────────── */
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('cs-visible'); obs.unobserve(el); } },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`cs-reveal${className ? ` ${className}` : ''}`}>{children}</div>;
}

/* ── Eyebrow "PREFIX — Carlofty" ─────────────────── */
function Eyebrow({ text }: { text: string }) {
  const idx = text.indexOf(' — ');
  if (idx === -1) return <p className="cs-eyebrow">{text}</p>;
  return (
    <p className="cs-eyebrow">
      {text.slice(0, idx)}
      {' — '}
      <a
        href="https://www.carlofty.com"
        target="_blank"
        rel="noopener noreferrer"
        className="cs-eyebrow__brand"
      >
        {text.slice(idx + 3)}
      </a>
    </p>
  );
}

/* ── Ban (no-entry) icon ─────────────────────────── */
function BanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="cs-ban-icon">
      <circle cx="8" cy="8" r="6.5" stroke="#E53935" strokeWidth="1.4"/>
      <line x1="3.6" y1="12.4" x2="12.4" y2="3.6" stroke="#E53935" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Animated counter outcome card ───────────────── */
function OutcomeCard({ icon, prefix, count, suffix, label }: {
  icon: React.ReactNode;
  prefix: string;
  count: number;
  suffix: string;
  label: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.unobserve(el);
      if (count === 0) { setDisplayed(0); return; }
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayed(Math.round(eased * count));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [count]);

  return (
    <div className="cs-outcome-card" ref={ref}>
      <span className="cs-outcome-card__icon">{icon}</span>
      <strong className="cs-outcome-card__value">{prefix}{displayed}{suffix}</strong>
      <p className="cs-outcome-card__label">{label}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
export default function CarloftyCaseStudy({ onBack }: Props) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
  };

  const solutions = [
    {
      icon: <Stack size={22} weight="fill" />,
      title: 'Design System Built From The v1 Inconsistencies',
      body: 'Before any screen was redesigned, I audited the v1 and extracted what was working. From that I built a component library — tokens, patterns, and interaction states — that gave engineering a single source of truth. This alone reduced back-and-forth during handoff and gave the product a consistent visual language for the first time.',
      tags: ['Component Library', 'Tokens', 'Dev Handoff', 'Consistency'],
      video: carloftyDesignSystemVideo,
    },
    {
      icon: <DeviceMobile size={22} weight="fill" />,
      title: 'Progressive Onboarding — Collect Less, Convert More',
      body: "The research showed onboarding was the platform's biggest drop-off point. I redesigned it around progressive disclosure — gathering only what was needed at each stage, triggered by user intent and platform requirements. The signup experience went from feeling like a compliance task to feeling like a product worth committing to, while still maintaining compliance.",
      tags: ['Progressive Disclosure', 'Reduced cognitive load'],
    },
    {
      icon: <CreditCard size={22} weight="fill" />,
      title: 'Transparent Payment Flow — Naira In, Auction Confirmation Out',
      body: "I designed the core payment journey around the constraint that made Carlofty different: dealers fund in Naira, Carlofty handles FX and pays the auction in the dealer's name — across Copart, Manheim, and IAAI. The UI made every step of that process legible. Exchange rate, payment status, admin confirmation, and final receipt — each stage had a clear state, a clear message, and a clear next action. No dead ends. No uncertainty.",
      tags: ['Payment States', 'Status Tracking', 'Cross-Border UX'],
    },
    {
      icon: <Browsers size={22} weight="fill" />,
      title: 'Admin Inventory Dashboard — Operations At Scale',
      body: 'The operations team needed structure. I designed a management layer that gave them a clear view of every dealer, every vehicle, and every auction state — with the ability to act on any of it without leaving the dashboard. Manual communication dropped. Operational clarity went up.',
      tags: ['Inventory Management'],
    },
  ];

  return (
    <div className="cs-page">
      <Navbar activePage="Work" onNavigate={handleNav} />

      <div className="cs-content">

        {/* ── Back ────────────────────────────── */}
        <div className="cs-back-row">
          <button className="cs-back-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11.5L4.5 7L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go back
          </button>
        </div>

        {/* ── HERO ────────────────────────────── */}
        <Reveal className="cs-hero">
          <p className="cs-breadcrumb">
            Case study —{' '}
            <a
              href="https://www.carlofty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cs-breadcrumb__brand"
            >
              Carlofty
            </a>
          </p>
          <h1 className="cs-hero__title">
            Designing Trust into a Broken Payment Experience For Cross-Border Car Sourcing
          </h1>
          <p className="cs-hero__overview">
            How I established design direction, built a product from v1, and helped facilitate
            thousands of dollars in auction transactions — including a record 10-minute Copart
            payment.
          </p>
          <div className="cs-meta-grid">
            <div className="cs-meta-cell">
              <span className="cs-meta-label">Year</span>
              <span className="cs-meta-value">2026</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--bl">
              <span className="cs-meta-label">My Role</span>
              <span className="cs-meta-value">Lead Product Designer</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--bt">
              <span className="cs-meta-label">Team</span>
              <span className="cs-meta-value">1 Designer, 1 PM, 3 Engineers</span>
            </div>
            <div className="cs-meta-cell cs-meta-cell--bt cs-meta-cell--bl">
              <span className="cs-meta-label">Deliverables</span>
              <span className="cs-meta-value">Design system, Auction Flow, Payment Flow, Admin Dashboard, Dealer + Buyer Experience.</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <img src={carloftyHeroImg} alt="Carlofty landing page" className="cs-img"/>
        </Reveal>

        {/* ── 1. MY ROLE ──────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="MY ROLE — Carlofty"/>
          <h2 className="cs-heading">Lead Product Designer</h2>
          <p className="cs-body">
            I was responsible for design direction, system, flows, and handoff. I worked directly
            with the PM and engineers to translate user pain and business goals into a product that
            actually worked.
          </p>
          <div className="cs-tags">
            {['UX Research','Competitor Analysis','Design System','User Flows','Prototyping','Dev Handoff'].map(t => (
              <span key={t} className="cs-tag">{t}</span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <VideoInView src={carloftyRoleVideo} className="cs-img cs-video"/>
        </Reveal>

        {/* ── 2. THE CHALLENGE ────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="THE CHALLENGE — Carlofty"/>
          <h2 className="cs-heading">Dealers send money to people they've never met, for cars they haven't seen, with no way to track either.</h2>
          <p className="cs-body">
            Sourcing cars from foreign auctions is common practice for Nigerian dealers and buyers.
            The barrier isn't knowledge — it's infrastructure. You cannot pay Copart, Manheim, or
            IAAI directly in Naira, from Nigeria, in your own name.
          </p>
          <p className="cs-body">
            That gap created a broker economy with no accountability. Money changed hands
            informally. Tracking didn't exist. And when things went wrong, there was no recourse.
          </p>
          <div className="cs-callout-red">
            <p className="cs-callout-red__text">You sent money. Then you waited. And hoped.</p>
          </div>
          <p className="cs-body">
            The v1 product existed but had no clear direction — inconsistent components, undefined
            flows, and no structured path through the core transaction. Both dealers and buyers
            were underserved.
          </p>
          <div className="cs-ban-list">
            {[
              ["No Direct Payment Path", "Naira couldn't reach foreign auctions without a middleman"],
              ['Broker Exploitation', 'Hidden fees, no accountability, money lost with no recourse'],
              ['Zero Tracking', 'Once funds left the customer, visibility ended completely'],
              ['No Design Foundation', 'Inconsistent v1 with no system, no flows, no direction'],
            ].map(([b, r]) => (
              <div key={b} className="cs-ban-item">
                <BanIcon/>
                <p className="cs-ban-item__text"><strong>{b}</strong> — {r}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <img src={carloftyChallengeImg} alt="Carlofty dealer dashboard" className="cs-img"/>
        </Reveal>

        {/* ── RESEARCH intro ───────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="RESEARCH — Carlofty"/>
          <h2 className="cs-heading">Understanding The Problem Before Opening Figma</h2>
          <p className="cs-body">
            I ran three layers of research before touching any UI — competitor analysis, user
            interviews with dealers and buyers, and a full product audit. Due to an NDA, specific
            findings are kept at the level of insight rather than detail.
          </p>
        </Reveal>

        {/* ── 1. COMPETITOR ANALYSIS ───────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="1. COMPETITOR ANALYSIS — Carlofty"/>
          <h2 className="cs-heading">Three Platforms. Three Different Approach. One Clear Gap.</h2>
          <p className="cs-body">
            I mapped Carlofty against existing players in the cross-border vehicle sourcing space
            — looking at target audience, inventory quality, financing models, and core
            differentiation.
          </p>
          <div className="cs-callout-gray">
            <p className="cs-callout-gray__label">WHAT I FOUND</p>
            <p className="cs-callout-gray__body">
              Competitors either served individual buyers with mixed-quality inventory, or importers
              working with salvage cars. None were serving professional dealers with a quality
              guarantee and financing infrastructure. That gap was Carlofty's advantage — and the
              design had to make it legible at every touchpoint.
            </p>
          </div>
        </Reveal>

        {/* ── 2. USER RESEARCH ─────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="2. USER RESEARCH — Carlofty"/>
          <h2 className="cs-heading">Dealers Knew What They Needed. The Product Wasn't Delivering It.</h2>
          <p className="cs-body">
            I mapped the needs, goals, and frustrations of both dealers and buyers through user
            stories and pain point analysis. Three consistent themes emerged across both user types.
          </p>
          <div className="cs-findings">
            {[
              { num:'01', title:'Visibility was missing', body:'Users needed to see what was happening at every stage — auction activity, payment status, order progress. The v1 gave them almost none of this. Decisions were being made without inclusion.' },
              { num:'02', title:'Trust had to be earned through the UI', body:"Sending significant money to a platform for a car they hadn't physically seen required a level of confidence the product wasn't building. Every unclear step eroded that confidence further." },
              { num:'03', title:'Complexity was being dumped on the user', body:"The backend process of cross-border payment and sourcing is genuinely complex. Users didn't need to understand all of it — they needed the product to absorb that complexity and surface only what mattered." },
            ].map(f => (
              <div key={f.num} className="cs-finding">
                <span className="cs-finding__num">{f.num}</span>
                <div>
                  <strong className="cs-finding__title">{f.title}</strong>
                  <p className="cs-finding__text">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cs-callout-red">
            <p className="cs-callout-red__text">
              Money moved. Nothing else did. That one insight shaped every design decision that followed.
            </p>
          </div>
        </Reveal>

        {/* ── 3. PRODUCT AUDIT ─────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="3. PRODUCT AUDIT — Carlofty"/>
          <h2 className="cs-heading">The v1 had Good Intent. The Execution Created Friction At Every Step.</h2>
          <p className="cs-body">
            I audited the existing product end-to-end — from onboarding to payment to admin
            management. What I found were compounding friction points that made the product feel
            harder than the problem it was solving.
          </p>
          <div className="cs-audit-grid">
            {[
              { icon:<UserMinus size={20} weight="fill"/>, title:'Onboarding Dropped Users Before They Started', body:'The signup process asked for too much, too soon. Cognitive load was high and the time-to-value gap was wide. Most users quit before reaching the core product.' },
              { icon:<CreditCard size={20} weight="fill"/>, title:'Payment Had No Clear States', body:"Users couldn't tell what stage their payment was in, who was handling it, or what came next. The flow had no defined states between \"paid\" and \"done.\"" },
              { icon:<Browsers size={20} weight="fill"/>, title:'Admin Had No Structured Overview', body:'The operations team had no clean way to manage dealer inventory or track auction statuses at scale. Everything relied on manual communication.' },
              { icon:<Stack size={20} weight="fill"/>, title:'No Design System To Build From', body:'Inconsistent components, undefined patterns, and no shared language between design and engineering meant every new screen was starting from scratch.' },
            ].map(c => (
              <div key={c.title} className="cs-audit-card">
                <span className="cs-audit-card__icon">{c.icon}</span>
                <strong className="cs-audit-card__title">{c.title}</strong>
                <p className="cs-audit-card__body">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="cs-video-label">My waitlist Landing Page Redesign:</div>
          <VideoInView src={carloftyWaitlistVideo} className="cs-img cs-video"/>
        </Reveal>

        {/* ── 4. HOW CAN THIS BE IMPROVED? ──────── */}
        <Reveal className="cs-section">
          <Eyebrow text="4. HOW CAN THIS PRODUCT BE IMPROVED? — Carlofty"/>
          <h2 className="cs-heading">Four Questions That Shaped The Design Direction</h2>
          <p className="cs-body">
            From the research, I framed the design challenge around four questions that became the
            filter for every decision made downstream.
          </p>
          <div className="cs-findings">
            {[
              { num:'01', title:'Make the payment process feel transparent and trustworthy without exposing the complexity behind it?' },
              { num:'02', title:'Reduce onboarding friction without compromising the verification standards the platform needs?' },
              { num:'03', title:'Give dealers visibility into their transactions without overwhelming them with operational detail?' },
              { num:'04', title:'Build a design system from an inconsistent v1 that both engineering and future designers can work from?' },
            ].map(q => (
              <div key={q.num} className="cs-finding">
                <span className="cs-finding__num">{q.num}</span>
                <div>
                  <span className="cs-how-can-we">How can we</span>
                  <strong className="cs-finding__title">{q.title}</strong>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── 5. GOALS ─────────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="5. GOALS — Carlofty"/>
          <h2 className="cs-heading">Four Goals. Two Users.</h2>
          <p className="cs-body">
            The research pointed to four clear problems the product had to solve — for dealers,
            buyers, and the operations team running the platform. Each goal was tied directly to a
            user need or a business risk.
          </p>
          <div className="cs-goals-grid">
            {[
              { num:'01', body:'Remove the broker from the payment chain — let dealers transact directly, in their own name, without intermediaries' },
              { num:'02', body:'Redesign onboarding so dealers reach the core product faster — reducing drop-off before they ever place a bid' },
              { num:'03', body:'Build payment flows with full visibility — every status, every step, from Naira deposit to auction confirmation' },
              { num:'04', body:'Give the operations team a structured layer to manage dealer inventory and auction states without relying on manual back-and-forth' },
            ].map(g => (
              <div key={g.num} className="cs-goal-cell">
                <span className="cs-goal-cell__num">{g.num}</span>
                <p className="cs-goal-cell__body">{g.body}</p>
              </div>
            ))}
          </div>
          <div className="cs-callout-gray">
            <p className="cs-callout-gray__label">DESIGN PRINCIPLE FROM RESEARCH</p>
            <p className="cs-callout-gray__body">
              Absorb the complexity. Surface only what the user needs at that exact moment. The
              backend process of cross-border FX, auction bidding, and logistics is genuinely hard
              — the product's job was to make it feel simple without hiding what mattered.
            </p>
          </div>
        </Reveal>

        {/* ── 6. DESIGN SOLUTION ───────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="6. DESIGN SOLUTION — Carlofty"/>
          <h2 className="cs-heading">Structure First. Trust Throughout. Speed As The Proof.</h2>
          <p className="cs-body">
            Every solution traced back to a research finding. Nothing was designed for aesthetics
            first — each decision was made to reduce a specific friction, close a specific gap, or
            earn a specific moment of trust.
          </p>
        </Reveal>

        {/* ── Stacking solution cards ───────────── */}
        <div className="cs-solutions-stack">
          {solutions.map((s, i) => (
            <div key={s.title} className="cs-solution-sticky" style={{ zIndex: i + 1 }}>
              <div className="cs-solution">
                <span className="cs-solution__icon">{s.icon}</span>
                <strong className="cs-solution__title">{s.title}</strong>
                <p className="cs-body">{s.body}</p>
                <div className="cs-tags">
                  {s.tags.map(t => <span key={t} className="cs-tag">{t}</span>)}
                </div>
                {'video' in s
                  ? <VideoInView src={s.video!} className="cs-img cs-solution__img cs-video" />
                  : <img src={carloftyDashboardImg} alt={s.title} className="cs-img cs-solution__img"/>
                }
              </div>
            </div>
          ))}
        </div>

        <Reveal>
          <div className="cs-callout-red cs-callout-red--italic">
            <p className="cs-callout-red__text">
              The design wasn't just making things look cleaner — it was restructuring how trust
              was built at every step of a high-stakes financial transaction.
            </p>
          </div>
        </Reveal>

        {/* ── 7. OUTCOME ───────────────────────── */}
        <Reveal className="cs-section">
          <Eyebrow text="7. OUTCOME — Carlofty"/>
          <h2 className="cs-heading">The Platform Works. The Numbers Show It.</h2>
          <p className="cs-body">
            Due to an NDA, specific internal metrics are not shared. The outcomes below reflect
            what the platform has demonstrably achieved since the redesign shipped.
          </p>
          <div className="cs-outcome-grid">
            <OutcomeCard
              icon={<TrendUp size={20} weight="fill"/>}
              prefix="$"
              count={2}
              suffix="M+"
              label="In verified cross-border auction transactions facilitated"
            />
            <OutcomeCard
              icon={<Lightning size={20} weight="fill"/>}
              prefix=""
              count={10}
              suffix=" min"
              label="Fastest Copart auction payment recorded on the platform"
            />
            <OutcomeCard
              icon={<Package size={20} weight="fill"/>}
              prefix=""
              count={3}
              suffix=" auctions"
              label="Copart, Manheim & IAAI — one seamless payment flow"
            />
            <OutcomeCard
              icon={<ShieldCheck size={20} weight="fill"/>}
              prefix=""
              count={0}
              suffix=" brokers"
              label="Dealers transact directly, in their own name or Carlofty's Name."
            />
          </div>
          <div className="cs-callout-gray">
            <p className="cs-callout-gray__label">WHAT THIS CASE STUDY DEMONSTRATES</p>
            <p className="cs-callout-gray__body">
              End-to-end product design ownership on a live fintech-adjacent platform — from
              research and competitive analysis through design systems, complex payment flows,
              onboarding redesign, and admin tooling. Shipped as the sole product designer, working
              directly with a PM and engineering team in a fast-moving, high-stakes environment.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <VideoInView src={carloftyOutcomeVideo} className="cs-img cs-video"/>
        </Reveal>

        {/* ── Scroll to top ─────────────────────── */}
        <div className="cs-scroll-top-wrap">
          <button className="cs-scroll-top-btn" onClick={scrollToTopSmooth}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Scroll to top
          </button>
        </div>

        {/* ── Footer ────────────────────────────── */}
        <div className="cs-footer-wrap">
          <Footer />
        </div>

      </div>
    </div>
  );
}
