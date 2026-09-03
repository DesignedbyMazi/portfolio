import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Stack, DeviceMobile, CreditCard, Browsers, UserMinus,
  TrendUp, Lightning, Package, ShieldCheck,
} from '@phosphor-icons/react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlareHover from '../components/GlareHover';
import './CarloftyCaseStudy.css';

/* ── Types ───────────────────────────────────────── */
interface HeroContent {
  breadcrumb?: string; title?: string; overview?: string;
  metaYear?: string; metaRole?: string; metaTeam?: string;
  metaDeliverables?: string; imageUrl?: string;
}
interface SectionBase { visible?: boolean; sectionLabel?: string; eyebrow?: string; heading?: string; body?: string; }
interface MyRoleContent extends SectionBase { tags?: string[]; videoUrl?: string; }
interface ChallengeContent extends SectionBase {
  body1?: string; body2?: string; body3?: string;
  calloutRed?: string; banItems?: [string, string][]; imageUrl?: string;
}
interface CompetitorContent extends SectionBase { calloutLabel?: string; calloutBody?: string; }
interface UserResearchContent extends SectionBase {
  findings?: { num: string; title: string; body: string }[];
  calloutRed?: string;
}
interface AuditContent extends SectionBase {
  cards?: { icon: string; title: string; body: string }[];
  videoLabel?: string; videoUrl?: string;
}
interface ImprovementContent extends SectionBase {
  questions?: { num: string; title: string }[];
}
interface GoalsContent extends SectionBase {
  cells?: { num: string; body: string }[];
  calloutLabel?: string; calloutBody?: string;
}
interface SolutionsContent extends SectionBase {
  cards?: { icon: string; title: string; body: string; tags: string[]; mediaUrl?: string; mediaType?: string }[];
}
interface OutcomeContent extends SectionBase {
  cards?: { icon: string; prefix: string; count: number; suffix: string; label: string }[];
  calloutLabel?: string; calloutBody?: string; videoUrl?: string;
}
interface CaseStudyFull {
  id: string; slug: string; title: string; description?: string;
  card_image_url?: string; published: boolean; order?: number;
  content: {
    hero?: HeroContent;
    myRole?: MyRoleContent;
    challenge?: ChallengeContent;
    research?: SectionBase;
    competitor?: CompetitorContent;
    userResearch?: UserResearchContent;
    audit?: AuditContent;
    improvement?: ImprovementContent;
    goals?: GoalsContent;
    solutions?: SolutionsContent;
    outcome?: OutcomeContent;
  };
}

/* ── Icon map ────────────────────────────────────── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Stack:        <Stack size={20} weight="fill" />,
  DeviceMobile: <DeviceMobile size={20} weight="fill" />,
  CreditCard:   <CreditCard size={20} weight="fill" />,
  Browsers:     <Browsers size={20} weight="fill" />,
  UserMinus:    <UserMinus size={20} weight="fill" />,
  Package:      <Package size={20} weight="fill" />,
  ShieldCheck:  <ShieldCheck size={20} weight="fill" />,
  Lightning:    <Lightning size={20} weight="fill" />,
  TrendUp:      <TrendUp size={20} weight="fill" />,
};
const icon = (name: string) => ICON_MAP[name] ?? <Stack size={20} weight="fill" />;

/* ── Scroll helpers ──────────────────────────────── */
function scrollToTopSmooth() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ── VideoInView ─────────────────────────────────── */
function VideoInView({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current; if (!video) return;
    const obs = new IntersectionObserver(([e]) => {
      e.isIntersecting ? video.play().catch(() => {}) : video.pause();
    }, { threshold: 0.25 });
    obs.observe(video);
    return () => obs.disconnect();
  }, [src]);
  return <video ref={ref} src={src} muted loop playsInline preload="none" className={className} />;
}

/* ── Reveal ──────────────────────────────────────── */
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('cs-visible'); obs.unobserve(el); }
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`cs-reveal${className ? ` ${className}` : ''}`}>{children}</div>;
}

/* ── Eyebrow ─────────────────────────────────────── */
function Eyebrow({ text }: { text: string }) {
  const idx = text.indexOf(' — ');
  if (idx === -1) return <p className="cs-eyebrow">{text}</p>;
  return (
    <p className="cs-eyebrow">
      {text.slice(0, idx)}{' — '}
      <span className="cs-eyebrow__brand">{text.slice(idx + 3)}</span>
    </p>
  );
}

/* ── BanIcon ─────────────────────────────────────── */
function BanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="cs-ban-icon">
      <circle cx="8" cy="8" r="6.5" stroke="#E53935" strokeWidth="1.4"/>
      <line x1="3.6" y1="12.4" x2="12.4" y2="3.6" stroke="#E53935" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

/* ── OutcomeCard ─────────────────────────────────── */
function OutcomeCard({ icon: ic, prefix, count, suffix, label }: {
  icon: React.ReactNode; prefix: string; count: number; suffix: string; label: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.unobserve(el);
      if (count === 0) { setDisplayed(0); return; }
      const duration = 1200, start = performance.now();
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
      <span className="cs-outcome-card__icon">{ic}</span>
      <strong className="cs-outcome-card__value">{prefix}{displayed}{suffix}</strong>
      <p className="cs-outcome-card__label">{label}</p>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────── */
function CSSidebar({ activeId, navItems }: { activeId: string; navItems: { label: string; id: string }[] }) {
  return (
    <aside className="cs-sidebar" aria-label="Page navigation">
      <nav>
        {navItems.map(item => {
          const isActive = item.id === activeId;
          return (
            <button key={item.id}
              className={`cs-sidebar__item${isActive ? ' cs-sidebar__item--active' : ''}`}
              onClick={() => scrollToSection(item.id)}
              aria-current={isActive ? 'location' : undefined}
            >
              {isActive ? (
                <GlareHover width="fit-content" height="auto" background="transparent"
                  borderRadius="0" borderColor="transparent" glareColor="#ffffff"
                  glareOpacity={0.5} glareAngle={-30} glareSize={200}
                  transitionDuration={700} playOnce={false} triggerGlare={true}
                  className="cs-sidebar__glare">
                  <span className="cs-sidebar__label">{item.label}</span>
                </GlareHover>
              ) : (
                <span className="cs-sidebar__label">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* ── Media helper ────────────────────────────────── */
function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi|m4v|ogv)$/i.test(url);
}

/* ── Main component ──────────────────────────────── */
interface Props { slug: string; onNavigate?: (page: string) => void; onGoHome?: () => void; }

export default function CaseStudyPage({ slug, onNavigate, onGoHome }: Props) {
  const [study, setStudy] = useState<CaseStudyFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState('cs-sec-top');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();
      if (err || !data) { setError('Case study not found.'); setLoading(false); return; }
      setStudy(data as CaseStudyFull);
      setLoading(false);
    })();
  }, [slug]);

  const handleNav = useCallback((page: string) => {
    if (page === 'Home') { onGoHome?.(); window.location.href = '/'; }
    else onNavigate?.(page);
  }, [onGoHome, onNavigate]);

  /* Build nav items — mirrors exact content checks used by each section's render guard */
  const navItems = study ? (() => {
    const c = study.content;
    const lbl = (sec: SectionBase | undefined, fallback: string) => sec?.sectionLabel || fallback;
    const items: { label: string; id: string }[] = [{ label: 'Case Study', id: 'cs-sec-top' }];
    if (c.myRole?.visible !== false       && (c.myRole?.heading      || c.myRole?.body))
      items.push({ label: lbl(c.myRole, 'My Role'),                  id: 'cs-sec-role'          });
    if (c.challenge?.visible !== false    && (c.challenge?.heading   || c.challenge?.body1))
      items.push({ label: lbl(c.challenge, 'The Challenge'),         id: 'cs-sec-challenge'     });
    if (c.research?.visible !== false     && (c.research?.heading    || c.research?.body))
      items.push({ label: lbl(c.research, 'Research'),               id: 'cs-sec-research'      });
    if (c.competitor?.visible !== false   && (c.competitor?.heading  || c.competitor?.body))
      items.push({ label: lbl(c.competitor, 'Competitor Analysis'),  id: 'cs-sec-competitor'    });
    if (c.userResearch?.visible !== false && (c.userResearch?.heading || c.userResearch?.body))
      items.push({ label: lbl(c.userResearch, 'User Research'),      id: 'cs-sec-user-research' });
    if (c.audit?.visible !== false        && (c.audit?.heading       || c.audit?.body))
      items.push({ label: lbl(c.audit, 'Product Audit'),             id: 'cs-sec-audit'         });
    if (c.improvement?.visible !== false  && (c.improvement?.heading || c.improvement?.body))
      items.push({ label: lbl(c.improvement, 'Product Improvement'), id: 'cs-sec-improvement'   });
    if (c.goals?.visible !== false        && (c.goals?.heading       || c.goals?.body))
      items.push({ label: lbl(c.goals, 'Goals'),                     id: 'cs-sec-goals'         });
    if (c.solutions?.visible !== false    && (c.solutions?.heading   || (c.solutions?.cards && c.solutions.cards.length > 0)))
      items.push({ label: lbl(c.solutions, 'Solutions'),             id: 'cs-sec-solutions'     });
    if (c.outcome?.visible !== false      && (c.outcome?.heading     || c.outcome?.body))
      items.push({ label: lbl(c.outcome, 'Outcome'),                 id: 'cs-sec-outcome'       });
    return items;
  })() : [{ label: 'Case Study', id: 'cs-sec-top' }];

  /* Scrollspy */
  useEffect(() => {
    if (!study) return;
    const ids = navItems.map(n => n.id);
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id));
      const first = ids.find(id => visible.has(id));
      if (first) setActiveId(first);
    }, { rootMargin: '-80px 0px -45% 0px', threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [study]);

  const goBack = () => { window.history.back(); };

  if (loading) return (
    <div className="cs-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <span style={{ fontSize:'0.9rem', color:'var(--color-text-secondary)' }}>Loading…</span>
    </div>
  );

  if (error || !study) return (
    <div className="cs-page" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:16 }}>
      <span style={{ fontSize:'1rem', color:'var(--color-text-primary)', fontWeight:600 }}>Not found</span>
      <span style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)' }}>{error}</span>
      <button className="cs-back-btn" onClick={goBack}>← Go back</button>
    </div>
  );

  const c = study.content;

  return (
    <div className="cs-page">
      <Navbar activePage="Work" onNavigate={handleNav} pageLabel={study.title} showViewWorks={false} onGoHome={onGoHome} />

      <div className="cs-outer">
        <CSSidebar activeId={activeId} navItems={navItems} />

        <div className="cs-content">

          {/* Back */}
          <div className="cs-back-row">
            <button className="cs-back-btn" onClick={goBack}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M9 11.5L4.5 7L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Go back
            </button>
          </div>

          {/* ── HERO ─────────────────────────────────── */}
          <div id="cs-sec-top">
            <Reveal className="cs-hero">
              {c.hero?.breadcrumb && (
                <p className="cs-breadcrumb">{c.hero.breadcrumb}</p>
              )}
              {c.hero?.title && <h1 className="cs-hero__title">{c.hero.title}</h1>}
              {c.hero?.overview && <div className="cs-hero__overview cs-rte" dangerouslySetInnerHTML={{ __html: c.hero.overview }} />}
              {(c.hero?.metaYear || c.hero?.metaRole || c.hero?.metaTeam || c.hero?.metaDeliverables) && (
                <div className="cs-meta-grid">
                  {c.hero?.metaYear && (
                    <div className="cs-meta-cell">
                      <span className="cs-meta-label">Year</span>
                      <span className="cs-meta-value">{c.hero.metaYear}</span>
                    </div>
                  )}
                  {c.hero?.metaRole && (
                    <div className="cs-meta-cell cs-meta-cell--bl">
                      <span className="cs-meta-label">My Role</span>
                      <span className="cs-meta-value">{c.hero.metaRole}</span>
                    </div>
                  )}
                  {c.hero?.metaTeam && (
                    <div className="cs-meta-cell cs-meta-cell--bt">
                      <span className="cs-meta-label">Team</span>
                      <span className="cs-meta-value">{c.hero.metaTeam}</span>
                    </div>
                  )}
                  {c.hero?.metaDeliverables && (
                    <div className="cs-meta-cell cs-meta-cell--bt cs-meta-cell--bl">
                      <span className="cs-meta-label">Deliverables</span>
                      <span className="cs-meta-value">{c.hero.metaDeliverables}</span>
                    </div>
                  )}
                </div>
              )}
            </Reveal>
            {c.hero?.imageUrl && (
              <Reveal>
                {isVideoUrl(c.hero.imageUrl)
                  ? <VideoInView src={c.hero.imageUrl} className="cs-img cs-video" />
                  : <img src={c.hero.imageUrl} alt={study.title} className="cs-img" loading="lazy" decoding="async" />
                }
              </Reveal>
            )}
          </div>

          {/* ── MY ROLE ──────────────────────────────── */}
          {c.myRole?.visible !== false && (c.myRole?.heading || c.myRole?.body) && (
            <div id="cs-sec-role">
              <Reveal className="cs-section">
                {c.myRole?.eyebrow && <Eyebrow text={c.myRole.eyebrow} />}
                {c.myRole?.heading && <h2 className="cs-heading">{c.myRole.heading}</h2>}
                {c.myRole?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.myRole.body }} />}
                {c.myRole?.tags && c.myRole.tags.length > 0 && (
                  <div className="cs-tags">
                    {c.myRole.tags.map(t => <span key={t} className="cs-tag">{t}</span>)}
                  </div>
                )}
              </Reveal>
              {c.myRole?.videoUrl && (
                <Reveal>
                  {isVideoUrl(c.myRole.videoUrl)
                    ? <VideoInView src={c.myRole.videoUrl} className="cs-img cs-video" />
                    : <img src={c.myRole.videoUrl} alt="My role" className="cs-img" loading="lazy" decoding="async" />
                  }
                </Reveal>
              )}
            </div>
          )}

          {/* ── THE CHALLENGE ─────────────────────────── */}
          {c.challenge?.visible !== false && (c.challenge?.heading || c.challenge?.body1) && (
            <div id="cs-sec-challenge">
              <Reveal className="cs-section">
                {c.challenge?.eyebrow && <Eyebrow text={c.challenge.eyebrow} />}
                {c.challenge?.heading && <h2 className="cs-heading">{c.challenge.heading}</h2>}
                {c.challenge?.body1 && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.challenge.body1 }} />}
                {c.challenge?.body2 && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.challenge.body2 }} />}
                {c.challenge?.calloutRed && (
                  <div className="cs-callout-red">
                    <p className="cs-callout-red__text">{c.challenge.calloutRed}</p>
                  </div>
                )}
                {c.challenge?.body3 && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.challenge.body3 }} />}
                {c.challenge?.banItems && c.challenge.banItems.length > 0 && (
                  <div className="cs-ban-list">
                    {c.challenge.banItems.map(([b, r], i) => (
                      <div key={i} className="cs-ban-item">
                        <BanIcon />
                        <p className="cs-ban-item__text"><strong>{b}</strong> — {r}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
              {c.challenge?.imageUrl && (
                <Reveal>
                  {isVideoUrl(c.challenge.imageUrl)
                    ? <VideoInView src={c.challenge.imageUrl} className="cs-img cs-video" />
                    : <img src={c.challenge.imageUrl} alt="The challenge" className="cs-img" loading="lazy" decoding="async" />
                  }
                </Reveal>
              )}
            </div>
          )}

          {/* ── RESEARCH ──────────────────────────────── */}
          {c.research?.visible !== false && (c.research?.heading || c.research?.body) && (
            <div id="cs-sec-research">
              <Reveal className="cs-section">
                {c.research?.eyebrow && <Eyebrow text={c.research.eyebrow} />}
                {c.research?.heading && <h2 className="cs-heading">{c.research.heading}</h2>}
                {c.research?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.research.body }} />}
              </Reveal>
            </div>
          )}

          {/* ── COMPETITOR ANALYSIS ───────────────────── */}
          {c.competitor?.visible !== false && (c.competitor?.heading || c.competitor?.body) && (
            <div id="cs-sec-competitor">
              <Reveal className="cs-section">
                {c.competitor?.eyebrow && <Eyebrow text={c.competitor.eyebrow} />}
                {c.competitor?.heading && <h2 className="cs-heading">{c.competitor.heading}</h2>}
                {c.competitor?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.competitor.body }} />}
                {c.competitor?.calloutBody && (
                  <div className="cs-callout-gray">
                    {c.competitor.calloutLabel && <p className="cs-callout-gray__label">{c.competitor.calloutLabel}</p>}
                    <div className="cs-callout-gray__body cs-rte" dangerouslySetInnerHTML={{ __html: c.competitor.calloutBody }} />
                  </div>
                )}
              </Reveal>
            </div>
          )}

          {/* ── USER RESEARCH ─────────────────────────── */}
          {c.userResearch?.visible !== false && (c.userResearch?.heading || c.userResearch?.body) && (
            <div id="cs-sec-user-research">
              <Reveal className="cs-section">
                {c.userResearch?.eyebrow && <Eyebrow text={c.userResearch.eyebrow} />}
                {c.userResearch?.heading && <h2 className="cs-heading">{c.userResearch.heading}</h2>}
                {c.userResearch?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.userResearch.body }} />}
                {c.userResearch?.findings && c.userResearch.findings.length > 0 && (
                  <div className="cs-findings">
                    {c.userResearch.findings.map((f, i) => (
                      <div key={i} className="cs-finding">
                        <span className="cs-finding__num">{f.num}</span>
                        <div>
                          <strong className="cs-finding__title">{f.title}</strong>
                          <div className="cs-finding__text cs-rte" dangerouslySetInnerHTML={{ __html: f.body }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {c.userResearch?.calloutRed && (
                  <div className="cs-callout-red">
                    <p className="cs-callout-red__text">{c.userResearch.calloutRed}</p>
                  </div>
                )}
              </Reveal>
            </div>
          )}

          {/* ── PRODUCT AUDIT ─────────────────────────── */}
          {c.audit?.visible !== false && (c.audit?.heading || c.audit?.body) && (
            <div id="cs-sec-audit">
              <Reveal className="cs-section">
                {c.audit?.eyebrow && <Eyebrow text={c.audit.eyebrow} />}
                {c.audit?.heading && <h2 className="cs-heading">{c.audit.heading}</h2>}
                {c.audit?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.audit.body }} />}
                {c.audit?.cards && c.audit.cards.length > 0 && (
                  <div className="cs-audit-grid">
                    {c.audit.cards.map((card, i) => (
                      <div key={i} className="cs-audit-card">
                        <span className="cs-audit-card__icon">{icon(card.icon)}</span>
                        <strong className="cs-audit-card__title">{card.title}</strong>
                        <div className="cs-audit-card__body cs-rte" dangerouslySetInnerHTML={{ __html: card.body }} />
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
              {c.audit?.videoUrl && (
                <Reveal>
                  {c.audit.videoLabel && <div className="cs-video-label">{c.audit.videoLabel}</div>}
                  {isVideoUrl(c.audit.videoUrl)
                    ? <VideoInView src={c.audit.videoUrl} className="cs-img cs-video" />
                    : <img src={c.audit.videoUrl} alt={c.audit.videoLabel || 'Audit'} className="cs-img" loading="lazy" decoding="async" />
                  }
                </Reveal>
              )}
            </div>
          )}

          {/* ── PRODUCT IMPROVEMENT ───────────────────── */}
          {c.improvement?.visible !== false && (c.improvement?.heading || c.improvement?.body) && (
            <div id="cs-sec-improvement">
              <Reveal className="cs-section">
                {c.improvement?.eyebrow && <Eyebrow text={c.improvement.eyebrow} />}
                {c.improvement?.heading && <h2 className="cs-heading">{c.improvement.heading}</h2>}
                {c.improvement?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.improvement.body }} />}
                {c.improvement?.questions && c.improvement.questions.length > 0 && (
                  <div className="cs-findings">
                    {c.improvement.questions.map((q, i) => (
                      <div key={i} className="cs-finding">
                        <span className="cs-finding__num">{q.num}</span>
                        <div>
                          <span className="cs-how-can-we">How can we</span>
                          <strong className="cs-finding__title">{q.title}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          )}

          {/* ── GOALS ─────────────────────────────────── */}
          {c.goals?.visible !== false && (c.goals?.heading || c.goals?.body) && (
            <div id="cs-sec-goals">
              <Reveal className="cs-section">
                {c.goals?.eyebrow && <Eyebrow text={c.goals.eyebrow} />}
                {c.goals?.heading && <h2 className="cs-heading">{c.goals.heading}</h2>}
                {c.goals?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.goals.body }} />}
                {c.goals?.cells && c.goals.cells.length > 0 && (
                  <div className="cs-goals-grid">
                    {c.goals.cells.map((cell, i) => (
                      <div key={i} className="cs-goal-cell">
                        <span className="cs-goal-cell__num">{cell.num}</span>
                        <div className="cs-goal-cell__body cs-rte" dangerouslySetInnerHTML={{ __html: cell.body }} />
                      </div>
                    ))}
                  </div>
                )}
                {c.goals?.calloutBody && (
                  <div className="cs-callout-gray">
                    {c.goals.calloutLabel && <p className="cs-callout-gray__label">{c.goals.calloutLabel}</p>}
                    <div className="cs-callout-gray__body cs-rte" dangerouslySetInnerHTML={{ __html: c.goals.calloutBody }} />
                  </div>
                )}
              </Reveal>
            </div>
          )}

          {/* ── SOLUTIONS ─────────────────────────────── */}
          {c.solutions?.visible !== false && (c.solutions?.heading || (c.solutions?.cards && c.solutions.cards.length > 0)) && (
            <div id="cs-sec-solutions">
              {(c.solutions?.eyebrow || c.solutions?.heading || c.solutions?.body) && (
                <Reveal className="cs-section">
                  {c.solutions?.eyebrow && <Eyebrow text={c.solutions.eyebrow} />}
                  {c.solutions?.heading && <h2 className="cs-heading">{c.solutions.heading}</h2>}
                  {c.solutions?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.solutions.body }} />}
                </Reveal>
              )}
              {c.solutions?.cards && c.solutions.cards.length > 0 && (
                <div className="cs-solutions-stack">
                  {c.solutions.cards.map((s, i) => (
                    <div key={i} className="cs-solution-sticky" style={{ zIndex: i + 1 }}>
                      <div className="cs-solution">
                        <span className="cs-solution__icon">{icon(s.icon)}</span>
                        <strong className="cs-solution__title">{s.title}</strong>
                        {s.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: s.body }} />}
                        {s.tags && s.tags.length > 0 && (
                          <div className="cs-tags">
                            {s.tags.map(t => <span key={t} className="cs-tag">{t}</span>)}
                          </div>
                        )}
                        {s.mediaUrl && (
                          s.mediaType === 'video' || isVideoUrl(s.mediaUrl)
                            ? <VideoInView src={s.mediaUrl} className="cs-img cs-solution__img cs-video" />
                            : <img src={s.mediaUrl} alt={s.title} className="cs-img cs-solution__img" loading="lazy" decoding="async" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── OUTCOME ───────────────────────────────── */}
          {c.outcome?.visible !== false && (c.outcome?.heading || c.outcome?.body) && (
            <div id="cs-sec-outcome">
              <Reveal className="cs-section">
                {c.outcome?.eyebrow && <Eyebrow text={c.outcome.eyebrow} />}
                {c.outcome?.heading && <h2 className="cs-heading">{c.outcome.heading}</h2>}
                {c.outcome?.body && <div className="cs-body cs-rte" dangerouslySetInnerHTML={{ __html: c.outcome.body }} />}
                {c.outcome?.cards && c.outcome.cards.length > 0 && (
                  <div className="cs-outcome-grid">
                    {c.outcome.cards.map((oc, i) => (
                      <OutcomeCard key={i}
                        icon={icon(oc.icon)}
                        prefix={oc.prefix}
                        count={oc.count}
                        suffix={oc.suffix}
                        label={oc.label}
                      />
                    ))}
                  </div>
                )}
                {c.outcome?.calloutBody && (
                  <div className="cs-callout-gray">
                    {c.outcome.calloutLabel && <p className="cs-callout-gray__label">{c.outcome.calloutLabel}</p>}
                    <div className="cs-callout-gray__body cs-rte" dangerouslySetInnerHTML={{ __html: c.outcome.calloutBody }} />
                  </div>
                )}
              </Reveal>
              {c.outcome?.videoUrl && (
                <Reveal>
                  {isVideoUrl(c.outcome.videoUrl)
                    ? <VideoInView src={c.outcome.videoUrl} className="cs-img cs-video" />
                    : <img src={c.outcome.videoUrl} alt="Outcome" className="cs-img" loading="lazy" decoding="async" />
                  }
                </Reveal>
              )}
            </div>
          )}

          {/* Scroll to top + footer */}
          <div className="cs-scroll-top-wrap">
            <button className="cs-scroll-top-btn" onClick={scrollToTopSmooth}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Scroll to top
            </button>
          </div>
          <div className="cs-footer-wrap"><Footer /></div>

        </div>
      </div>
    </div>
  );
}
