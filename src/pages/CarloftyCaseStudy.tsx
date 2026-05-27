import { useEffect, useRef } from 'react';
import carloftyLandingImg from '../assets/images/carlofty-landing.png';
import carloftyDashboardImg from '../assets/images/carlofty-dashboard.png';
import carloftyRoleVideo from '../assets/videos/carlofty-role.mp4';
import carloftyWaitlistVideo from '../assets/videos/carlofty-waitlist.mp4';
import './CarloftyCaseStudy.css';

interface Props {
  onBack: () => void;
}

const solutionCards = [
  {
    number: '01',
    title: 'Design System Built From The v1 Inconsistencies',
    description:
      'I audited every screen in v1, extracted all patterns, and built a token-based design system: buttons, inputs, badges, tables, navigation. This alone made the product feel 3× more consistent.',
    tags: ['Design System', 'Tokens', 'Component Library'],
    accentColor: 'rgba(255,255,255,0.2)',
  },
  {
    number: '02',
    title: 'Progressive Onboarding — Collect Less, Convert More',
    description:
      '8-step KYC before any value was killing conversion. I broke onboarding into progressive stages: browse first, verify only when you\'re ready to bid. Time-to-value dropped significantly.',
    tags: ['Onboarding', 'UX Strategy', 'Conversion'],
    accentColor: '#C0392B',
  },
  {
    number: '03',
    title: 'Real-Time Payment Rail With Trust Signals',
    description:
      'Every payment step now shows exactly where money goes, estimated time, what comes next. Wire receipts, exchange rate clarity, and status updates — all in context of the action.',
    tags: ['Payment UX', 'Transparency', 'Trust'],
    accentColor: 'rgba(255,255,255,0.2)',
  },
  {
    number: '04',
    title: 'Auction Intelligence Dashboard',
    description:
      'Dealers now manage bids, track won lots, review payments, and follow shipments from one view. One source of truth eliminated the main cause of dealer support tickets.',
    tags: ['Dashboard', 'Data Viz', 'Dealer Tools'],
    accentColor: '#C0392B',
  },
];

export default function CarloftyCaseStudy({ onBack }: Props) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Scroll-reveal for sections
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for sticky card stacking effect
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < 2) return;

    const observers: IntersectionObserver[] = [];

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const nextCard = cards[i + 1];
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.classList.add('is-covered');
          } else {
            card.classList.remove('is-covered');
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(nextCard);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const addSectionRef = (i: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[i] = el;
  };

  return (
    <div className="cs-page">
      {/* ── Top Nav ── */}
      <nav className="cs-nav">
        <button className="cs-nav__back" onClick={onBack}>
          ← Back
        </button>
        <span className="cs-nav__title">Carlofty · Case Study</span>
        <div className="cs-nav__spacer" />
      </nav>

      {/* ── Hero ── */}
      <div className="cs-hero cs-center" ref={addSectionRef(0)}>
        <span className="cs-eyebrow">Case Study</span>
        <h1 className="cs-hero__h1">
          Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing.
        </h1>
        <p className="cs-hero__p">
          Carlofty is a B2B platform that gives Nigerian car dealers direct access to U.S. wholesale
          auctions — Copart, Manheim, and IAAI — without a U.S. dealer license. I led end-to-end
          redesign: trust-first marketing site, dealer onboarding, payment flow, and auction
          dashboard.
        </p>
        <div className="cs-meta">
          <span className="cs-meta__item">
            <span className="cs-meta__label">Type</span>
            <span className="cs-meta__dot">·</span>
            <span>Product Design</span>
          </span>
          <span className="cs-meta__item">
            <span className="cs-meta__label">Timeline</span>
            <span className="cs-meta__dot">·</span>
            <span>Mar – Jun 2024</span>
          </span>
          <span className="cs-meta__item">
            <span className="cs-meta__label">Role</span>
            <span className="cs-meta__dot">·</span>
            <span>Lead Product Designer</span>
          </span>
        </div>
      </div>

      {/* ── Image 1 ── */}
      <div className="cs-center cs-image-wrap" ref={addSectionRef(1)}>
        <img src={carloftyLandingImg} alt="Carlofty landing page" className="cs-image" />
      </div>

      {/* ── Section: The Challenge ── */}
      <div className="cs-section cs-center" ref={addSectionRef(2)}>
        <span className="cs-eyebrow">01 · Challenge</span>
        <h2 className="cs-section__h2">A Product People Wanted to Trust, But Couldn't.</h2>
        <p className="cs-section__p">
          Carlofty was solving a real problem — but the product couldn't communicate trust at the
          right moments. Dealers were asked to send money internationally without enough visibility
          into what happened next.
        </p>
        <div className="cs-findings">
          {[
            'No real-time visibility into bids, payments, or shipment status.',
            'Dealers had to wire money before seeing confirmation of anything.',
            'Onboarding required too many documents upfront before any value.',
            'V1 had inconsistent UI patterns that made the product feel unpolished.',
          ].map((text, i) => (
            <div key={i} className="cs-finding">
              <span className="cs-finding__num">{i + 1}</span>
              <span className="cs-finding__text">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section: Discovery ── */}
      <div className="cs-section cs-center" ref={addSectionRef(3)}>
        <span className="cs-eyebrow">02 · Discovery</span>
        <h2 className="cs-section__h2">Trust Was The Missing Feature.</h2>
        <p className="cs-section__p">
          Every friction point in the experience mapped back to trust. Dealers didn't understand
          where their money went. They couldn't track their cars. The design problem wasn't workflow
          — it was credibility.
        </p>
        <div className="cs-image-wrap">
          <img src={carloftyDashboardImg} alt="Carlofty dealer dashboard" className="cs-image" />
        </div>
      </div>

      {/* ── Section: My Role ── */}
      <div className="cs-section cs-center" ref={addSectionRef(4)}>
        <span className="cs-eyebrow">03 · Role</span>
        <h2 className="cs-section__h2">What I Owned.</h2>
        <p className="cs-section__p">
          I was the sole designer. I ran discovery, designed every screen, built the component
          library, and worked directly with engineering. Scope: marketing site, dealer onboarding,
          auction browsing, payment flow, and the dealer dashboard.
        </p>
        <div className="cs-image-wrap">
          <video
            src={carloftyRoleVideo}
            controls
            playsInline
            muted
            className="cs-video"
          />
        </div>
      </div>

      {/* ── Section: Findings ── */}
      <div className="cs-section cs-center" ref={addSectionRef(5)}>
        <span className="cs-eyebrow">04 · Research</span>
        <h2 className="cs-section__h2">What Dealers Actually Needed.</h2>
        <p className="cs-section__p">
          Through 6 dealer interviews and support ticket analysis, three themes emerged:
        </p>
        <div className="cs-finding-cards">
          {[
            {
              num: '01',
              title: 'Proof before payment',
              desc: 'Dealers needed receipts and confirmations before they\'d trust the wire transfer.',
            },
            {
              num: '02',
              title: 'Live status, not silence',
              desc: 'No one knew what happened after they placed a bid. Real-time updates were essential.',
            },
            {
              num: '03',
              title: 'Simple first, complex later',
              desc: 'Progressive disclosure: show value before collecting documents.',
            },
          ].map((card) => (
            <div key={card.num} className="cs-finding-card">
              <span className="cs-finding-card__num">{card.num}</span>
              <strong className="cs-finding-card__title">{card.title}</strong>
              <p className="cs-finding-card__desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section: Waitlist Redesign ── */}
      <div className="cs-section cs-center" ref={addSectionRef(6)}>
        <span className="cs-eyebrow">05 · Execution</span>
        <h2 className="cs-section__h2">My Waitlist Landing Page Redesign.</h2>
        <p className="cs-section__p">
          Before rebuilding the product, I redesigned the marketing site to convert skeptical dealers
          from the first scroll — social proof, clear pricing, frictionless sign-up.
        </p>
        <div className="cs-image-wrap">
          <video
            src={carloftyWaitlistVideo}
            controls
            playsInline
            muted
            className="cs-video"
          />
        </div>
      </div>

      {/* ── Full-width Banner ── */}
      <div className="cs-banner">
        <h2>Buy Clean-Title U.S. Cars. Pay in Naira. Ship to Lagos.</h2>
      </div>

      {/* ── Design Solutions ── */}
      <div className="cs-solutions-intro cs-center" ref={addSectionRef(7)}>
        <span className="cs-eyebrow">06 · Design Solution</span>
        <h2 className="cs-section__h2">Four Design Decisions That Changed the Experience.</h2>
        <p className="cs-section__p">
          Each decision targeted a specific trust gap. Together they turned a fragile experience into
          one that converts.
        </p>
      </div>

      <div className="cs-solutions-track cs-center">
        {solutionCards.map((card, i) => (
          <div key={card.number} className="cs-solution-item">
            <div
              className="cs-solution-card"
              style={{ zIndex: i + 1 }}
              ref={(el) => { cardRefs.current[i] = el; }}
            >
              <div
                className="cs-solution-card__accent"
                style={{ background: card.accentColor }}
              />
              <span className="cs-solution-card__num">{card.number}</span>
              <h3 className="cs-solution-card__title">{card.title}</h3>
              <p className="cs-solution-card__desc">{card.description}</p>
              <div className="cs-solution-card__tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="cs-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="cs-solution-card__mock" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Results ── */}
      <div className="cs-section cs-center" ref={addSectionRef(8)}>
        <span className="cs-eyebrow">07 · Impact</span>
        <h2 className="cs-section__h2">What Shipped and What Changed.</h2>
        <div className="cs-stats">
          {[
            { stat: '$9M+', label: 'Deals facilitated' },
            { stat: '200+', label: 'Accessible auctions' },
            { stat: '498k+', label: 'Available listings' },
          ].map((s) => (
            <div key={s.stat} className="cs-stat-card">
              <span className="cs-stat-card__value">{s.stat}</span>
              <span className="cs-stat-card__label">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="cs-section__p" style={{ marginTop: 32 }}>
          The redesigned platform launched to early dealers in Q2 2024. Onboarding completion
          increased and dealer confusion support tickets dropped significantly in month one.
        </p>
      </div>

      {/* ── Scroll to Top ── */}
      <div className="cs-center cs-scroll-top-wrap">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cs-scroll-top"
        >
          ↑ Back to Top
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="cs-footer cs-center">
        <p className="cs-footer__text">
          Godswill Uche · designedbyuche@gmail.com · 2024
        </p>
      </div>
    </div>
  );
}
