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
    accentColor: 'rgba(255,255,255,0.15)',
  },
  {
    number: '02',
    title: 'Progressive Onboarding — Collect Less, Convert More',
    description:
      '8-step KYC before any value was killing conversion. I broke onboarding into progressive stages: browse first, verify only when ready to bid. Time-to-value dropped significantly.',
    tags: ['Onboarding', 'UX Strategy', 'Conversion'],
    accentColor: '#C0392B',
  },
  {
    number: '03',
    title: 'Real-Time Payment Rail With Trust Signals',
    description:
      'Every payment step now shows exactly where money goes, estimated time, what comes next. Wire receipts, exchange rate clarity, and status updates — all in context of the action.',
    tags: ['Payment UX', 'Transparency', 'Trust'],
    accentColor: 'rgba(255,255,255,0.15)',
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

const truths = [
  {
    num: '01',
    title: 'Trust is transactional',
    body: 'Every time a dealer had to take a leap of faith — wire money, wait for updates, hope the car arrived — the product had failed them.',
  },
  {
    num: '02',
    title: 'Visibility is the product',
    body: "Dealers didn't need more features. They needed to know what was happening at every step: bid status, payment receipt, shipment tracking.",
  },
  {
    num: '03',
    title: 'Complexity kills conversion',
    body: 'An 8-step KYC process before a dealer could do anything meaningful was not a security feature — it was a churn factory.',
  },
  {
    num: '04',
    title: 'Consistency is credibility',
    body: "Inconsistent UI patterns in v1 signalled an unfinished product. A design system wasn’t a nice-to-have — it was trust infrastructure.",
  },
];

export default function CarloftyCaseStudy({ onBack }: Props) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const els = revealRefs.current.filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cs-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length < 2) return;
    const observers: IntersectionObserver[] = [];
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const nextCard = cards[i + 1];
      const obs = new IntersectionObserver(
        ([entry]) => {
          card.classList.toggle('is-covered', entry.isIntersecting);
        },
        { threshold: 0.2 }
      );
      obs.observe(nextCard);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const ref = (i: number) => (el: HTMLDivElement | null) => {
    revealRefs.current[i] = el;
  };

  return (
    <div className="cs-page">

      {/* ── Top Nav ── */}
      <nav className="cs-nav">
        <button className="cs-nav__back" onClick={onBack}>
          ← Portfolio
        </button>
        <span className="cs-nav__title">Carlofty · Case Study</span>
        <div className="cs-nav__spacer" />
      </nav>

      {/* ── Hero ── */}
      <section className="cs-hero cs-center cs-reveal" ref={ref(0)}>
        <span className="cs-eyebrow">Case Study</span>
        <h1 className="cs-hero__h1">
          Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing.
        </h1>
        <p className="cs-hero__overview">
          Carlofty is a B2B platform that gives Nigerian car dealers direct access to U.S.
          wholesale auctions — Copart, Manheim, and IAAI — without a U.S. dealer license.
          I led the end-to-end redesign: a trust-first marketing site, dealer onboarding,
          payment flow, and a full auction dashboard.
        </p>
        <div className="cs-meta-strip">
          <div className="cs-meta-item">
            <span className="cs-meta-label">Company</span>
            <span className="cs-meta-value">Carlofty</span>
          </div>
          <div className="cs-meta-divider" />
          <div className="cs-meta-item">
            <span className="cs-meta-label">Timeline</span>
            <span className="cs-meta-value">Mar – Jun 2024</span>
          </div>
          <div className="cs-meta-divider" />
          <div className="cs-meta-item">
            <span className="cs-meta-label">Role</span>
            <span className="cs-meta-value">Lead Product Designer</span>
          </div>
        </div>
      </section>

      {/* ── Image 1 — before The Challenge ── */}
      <div className="cs-center cs-img-block cs-reveal" ref={ref(1)}>
        <img src={carloftyLandingImg} alt="Carlofty landing page" className="cs-media" />
      </div>

      {/* ── The Challenge ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(2)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">01 · Challenge</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">A Product People Wanted to Trust, But Couldn't.</h2>
          <p className="cs-p">
            Carlofty was solving a real, painful problem. But the product couldn't communicate
            trust at the moments that mattered most. Dealers were being asked to wire money
            internationally without visibility into what happened next.
          </p>
          <div className="cs-numbered-list">
            {[
              'No real-time visibility into bids, payments, or shipment status.',
              'Dealers had to wire money internationally before seeing any confirmation.',
              'Onboarding required too many documents before a dealer could do anything meaningful.',
              'V1 had inconsistent UI patterns that made the product feel unpolished and unfinished.',
            ].map((text, i) => (
              <div key={i} className="cs-numbered-item">
                <span className="cs-numbered-item__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cs-numbered-item__text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Was The Missing Feature — Image 2 ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(3)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">02 · Discovery</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Trust Was The Missing Feature.</h2>
          <p className="cs-p">
            Every friction point in the experience mapped back to one thing: trust.
            Dealers didn't understand where their money went. They couldn't track their cars.
            They weren't sure Carlofty was legitimate. The design problem wasn't the workflow
            — it was credibility at every touchpoint.
          </p>
        </div>
        <div className="cs-img-block">
          <img src={carloftyDashboardImg} alt="Carlofty dealer dashboard" className="cs-media" />
        </div>
      </section>

      {/* ── My Role + Video 1 ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(4)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">03 · Role</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Lead Product Designer.</h2>
          <p className="cs-p">
            I was the sole designer on this project. I owned the full design process — from
            discovery through delivery — working directly with the founder, engineering lead,
            and operations team. My scope covered the marketing site, dealer onboarding,
            auction browsing, payment flow, and the dealer dashboard.
          </p>
        </div>
        <div className="cs-img-block">
          <video
            src={carloftyRoleVideo}
            controls
            playsInline
            muted
            className="cs-media cs-media--video"
          />
        </div>
      </section>

      {/* ── Understanding The Problem ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(5)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">04 · Research</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Understanding The Problem Before Opening Figma.</h2>
          <p className="cs-p">
            Before designing anything, I spent two weeks in discovery. I reviewed the existing
            product, interviewed 6 dealers, and analysed 3 months of support tickets. The
            goal was to understand what the product was failing at — not just what it was
            missing.
          </p>
          <p className="cs-p">
            Three consistent failure patterns emerged across every conversation:
            money went in and silence came out; dealers didn't know if their bids were
            competitive; and the onboarding complexity meant many never reached the
            point of placing a bid.
          </p>
        </div>
      </section>

      {/* ── Four Truths ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(6)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">05 · Insight</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Those Four Truths Informed The Approach: One Clear Step.</h2>
          <p className="cs-p">
            Each interview revealed the same themes in different words. The product had
            four structural trust problems, and each one had a direct design solution.
          </p>
          <div className="cs-truths-grid">
            {truths.map((t) => (
              <div key={t.num} className="cs-truth-card">
                <span className="cs-truth-card__num">{t.num}</span>
                <strong className="cs-truth-card__title">{t.title}</strong>
                <p className="cs-truth-card__body">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dealers Know What They Needed ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(7)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">06 · Framing</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Dealers Know What They Needed. The Product Wasn't Delivering It.</h2>
          <p className="cs-p">
            The dealers I spoke to were not confused about what they wanted — they were
            frustrated that a product this ambitious couldn't do the basics right. They wanted
            to trust Carlofty. They just couldn't.
          </p>
          <div className="cs-callout">
            <p className="cs-callout__text">
              "What if the trust trigger is missing from the most important page — the one where
              they decide to wire money?"
            </p>
          </div>
          <p className="cs-p">
            This became the design north star. Every decision, from the marketing site
            restructure to the payment confirmation screen, was evaluated against it.
          </p>
        </div>
      </section>

      {/* ── The 4-Step Email Incident ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(8)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">07 · Diagnosis</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">The 4-Step Email Incident: The Execution Created Frictions At Every Step.</h2>
          <div className="cs-two-col">
            <div className="cs-two-col__left">
              <p className="cs-p">
                The v1 onboarding required dealers to complete a 4-step email verification
                sequence before accessing any part of the product. By the time they reached
                the dashboard, many had already lost confidence.
              </p>
              <p className="cs-p">
                This wasn't a feature — it was attrition by design. Each extra step was a
                moment where a dealer asked themselves whether this was worth it.
              </p>
            </div>
            <div className="cs-two-col__right">
              <div className="cs-incident-steps">
                {[
                  'Sign up form — email, password, phone',
                  'Verify email — check inbox, click link',
                  'Complete profile — business info, documents',
                  'Wait for admin approval — no ETA given',
                ].map((step, i) => (
                  <div key={i} className="cs-incident-step">
                    <span className="cs-incident-step__num">Step {i + 1}</span>
                    <span className="cs-incident-step__text">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waitlist Landing Page Redesign + Video 2 ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(9)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">08 · Execution</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">My Waitlist Landing Page Redesign.</h2>
          <p className="cs-p">
            Before rebuilding the product, I redesigned the marketing site. The goal was to
            convert skeptical dealers from the first scroll — using social proof, transparent
            pricing, and a frictionless sign-up that felt like a handshake, not a gate.
          </p>
        </div>
        <div className="cs-img-block">
          <video
            src={carloftyWaitlistVideo}
            controls
            playsInline
            muted
            className="cs-media cs-media--video"
          />
        </div>
      </section>

      {/* ── Full-width Banner ── */}
      <div className="cs-banner">
        <div className="cs-banner__inner">
          <h2 className="cs-banner__h2">
            Buy Clean-Title U.S. Cars.<br />
            Pay in Naira. Ship to Lagos.
          </h2>
          <p className="cs-banner__sub">
            Redesigning the moment a dealer decides to trust Carlofty with their money.
          </p>
        </div>
      </div>

      {/* ── Design Solution ── */}
      <section className="cs-solutions-intro cs-center cs-reveal" ref={ref(10)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">09 · Design Solution</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Four Questions That Shaped The Design Decisions.</h2>
          <p className="cs-p">
            Each decision targeted a specific trust gap identified in research. Together,
            they turned a fragile experience into one that earns dealer confidence from
            the first interaction.
          </p>
        </div>
      </section>

      {/* ── Two Users ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(11)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">Your Reality</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">Two Users.</h2>
          <div className="cs-users-row">
            <div className="cs-user-card">
              <span className="cs-user-card__role">Dealer</span>
              <p className="cs-user-card__desc">
                Nigerian car dealer. Wants to source U.S. vehicles at auction prices without
                a U.S. license. Needs to feel confident enough to wire money internationally.
              </p>
              <div className="cs-user-card__tags">
                <span>Bid on auctions</span>
                <span>Track payments</span>
                <span>Follow shipments</span>
              </div>
            </div>
            <div className="cs-user-card">
              <span className="cs-user-card__role">Admin</span>
              <p className="cs-user-card__desc">
                Carlofty operations team. Manages dealer verification, auction bids, payment
                confirmations, and shipment coordination across multiple ongoing transactions.
              </p>
              <div className="cs-user-card__tags">
                <span>Verify dealers</span>
                <span>Manage bids</span>
                <span>Process payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Scroll Cards ── */}
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
              <div className="cs-solution-card__header">
                <h3 className="cs-solution-card__title">{card.title}</h3>
                <span className="cs-solution-card__num">{card.number}</span>
              </div>
              <p className="cs-solution-card__desc">{card.description}</p>
              <div className="cs-solution-card__tags">
                {card.tags.map((tag) => (
                  <span key={tag} className="cs-tag">{tag}</span>
                ))}
              </div>
              <div className="cs-solution-card__mock">
                <div className="cs-mock-dots">
                  <span /><span /><span />
                </div>
                <div className="cs-mock-body">
                  <div className="cs-mock-line cs-mock-line--lg" />
                  <div className="cs-mock-line cs-mock-line--md" />
                  <div className="cs-mock-line cs-mock-line--sm" />
                  <div className="cs-mock-line cs-mock-line--md" style={{ marginTop: 16 }} />
                  <div className="cs-mock-line cs-mock-line--lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── The Product Metrics ── */}
      <section className="cs-section cs-center cs-reveal" ref={ref(12)}>
        <div className="cs-section-label">
          <span className="cs-eyebrow">10 · Impact</span>
        </div>
        <div className="cs-section-body">
          <h2 className="cs-h2">The Product Metrics: The Numbers Show It.</h2>
          <p className="cs-p">
            The redesigned platform launched to early dealers in Q2 2024. Onboarding
            completion increased, dealer confusion support tickets dropped, and the
            platform began scaling deal volume month over month.
          </p>
          <div className="cs-stats-grid">
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
        </div>
      </section>

      {/* ── Final product image ── */}
      <div className="cs-center cs-img-block cs-reveal" ref={ref(13)}>
        <img src={carloftyLandingImg} alt="Carlofty final design" className="cs-media" />
      </div>

      {/* ── Scroll to Top ── */}
      <div className="cs-top-wrap">
        <button
          className="cs-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ Back to Top
        </button>
      </div>

      {/* ── Footer ── */}
      <footer className="cs-footer cs-center">
        <p className="cs-footer__text">designedbyuche@gmail.com</p>
      </footer>

    </div>
  );
}
