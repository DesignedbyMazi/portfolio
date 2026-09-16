import profileImg from '../assets/images/profile.jpg';
import carloftyLogo from '../assets/images/carlofty-logo.svg';
import learnbetaLogo from '../assets/images/learnbeta-logo.svg';
import { useRef, useEffect } from 'react';
import TextType from './TextType';
import './Hero.css';

/* ── Constants ───────────────────────────────────────── */
const LONG_PRESS_MS  = 380;
const MOVE_CANCEL_PX = 8;
const SPRING_MS      = 620;

/* ── Caret helpers ───────────────────────────────────── */
function caretAt(x: number, y: number): { node: Text; offset: number } | null {
  const doc = document as any;
  try {
    if (doc.caretPositionFromPoint) {
      const p = doc.caretPositionFromPoint(x, y);
      if (p?.offsetNode?.nodeType === Node.TEXT_NODE)
        return { node: p.offsetNode as Text, offset: p.offset };
    }
    if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(x, y);
      if (r?.startContainer?.nodeType === Node.TEXT_NODE)
        return { node: r.startContainer as Text, offset: r.startOffset };
    }
  } catch { /* ignore cross-origin or sandboxed errors */ }
  return null;
}

function sentenceBounds(text: string, offset: number): [number, number] {
  let start = 0;
  for (let i = offset - 1; i > 0; i--) {
    if (/[.!?]/.test(text[i - 1]) && /\s/.test(text[i])) {
      start = i;
      while (start < text.length && /\s/.test(text[start])) start++;
      break;
    }
  }
  let end = text.length;
  for (let i = Math.max(start, offset); i < text.length; i++) {
    if (/[.!?]/.test(text[i])) { end = i + 1; break; }
  }
  return [start, end];
}

function wrapSentence(caret: { node: Text; offset: number }): HTMLElement | null {
  const text = caret.node.textContent ?? '';
  if (!text.trim()) return null;
  const [start, end] = sentenceBounds(text, caret.offset);
  if (end <= start) return null;
  const range = document.createRange();
  range.setStart(caret.node, start);
  range.setEnd(caret.node, end);
  const span = document.createElement('span');
  span.className = 'sentence-zoom';
  try {
    range.surroundContents(span);
    requestAnimationFrame(() => span.classList.add('sentence-zoom--active'));
    return span;
  } catch { return null; }
}

function unwrapNow(span: HTMLElement) {
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
  parent.normalize();
}

function unwrapAnimated(span: HTMLElement) {
  span.classList.remove('sentence-zoom--active');
  setTimeout(() => unwrapNow(span), 300);
}

/* ── Drag magnify hook ───────────────────────────────── */
function useDragMagnify(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDragging    = false;
    let startX        = 0;
    let startY        = 0;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupTimer:   ReturnType<typeof setTimeout> | null = null;
    let currentSpan:    HTMLElement | null = null;

    const activateDrag = () => {
      isDragging = true;
      el.classList.add('hero__avatar--dragging');
      el.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform  = 'scale(1.07)';
      el.style.zIndex     = '50';
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      longPressTimer = setTimeout(activateDrag, LONG_PRESS_MS);
    };

    const onTouchMove = (e: TouchEvent) => {
      const t  = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (!isDragging) {
        if (Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) {
          if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        }
        return;
      }
      e.preventDefault();
      el.style.transition = 'none';
      el.style.transform  = `translate(${dx}px, ${dy}px) scale(1.07)`;
      const check = caretAt(t.clientX, t.clientY);
      if (check && currentSpan?.contains(check.node)) return;
      if (currentSpan) { unwrapNow(currentSpan); currentSpan = null; }
      const fresh = caretAt(t.clientX, t.clientY);
      if (!fresh || el.contains(fresh.node) || !fresh.node.textContent?.trim()) return;
      currentSpan = wrapSentence(fresh);
    };

    const onTouchEnd = () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('hero__avatar--dragging');
      if (currentSpan) { unwrapAnimated(currentSpan); currentSpan = null; }
      el.style.transition = `transform ${SPRING_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      el.style.transform  = 'translate(0px, 0px) scale(1)';
      cleanupTimer = setTimeout(() => {
        el.style.transition = '';
        el.style.transform  = '';
        el.style.zIndex     = '';
      }, SPRING_MS + 50);
    };

    el.addEventListener('touchstart',  onTouchStart,  { passive: true  });
    el.addEventListener('touchmove',   onTouchMove,   { passive: false });
    el.addEventListener('touchend',    onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart',  onTouchStart);
      el.removeEventListener('touchmove',   onTouchMove);
      el.removeEventListener('touchend',    onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      if (longPressTimer) clearTimeout(longPressTimer);
      if (cleanupTimer)   clearTimeout(cleanupTimer);
      if (currentSpan) unwrapNow(currentSpan);
    };
  }, [ref]);
}

/* ── @mention link component ─────────────────────────── */
function Mention({ handle, href, logoSrc }: { handle: string; href?: string; logoSrc?: string }) {
  const label = logoSrc ? (
    <>
      <img src={logoSrc} alt={handle} className="hero__mention-logo" />
      <span className="hero__mention-text">{handle.replace(/^@/, '')}</span>
    </>
  ) : handle;

  if (href) {
    return (
      <a
        className="hero__mention"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }
  return <span className="hero__mention hero__mention--static">{label}</span>;
}

/* ── Component ───────────────────────────────────────── */
interface HeroProps {
  cvUrl?: string;
}

export default function Hero({ cvUrl = '#cv' }: HeroProps) {
  const avatarRef = useRef<HTMLDivElement>(null);
  useDragMagnify(avatarRef);

  return (
    <div className="hero">
      {/* ── Avatar ───────────────────────── */}
      <div className="hero__avatar" ref={avatarRef}>
        <img
          src={profileImg}
          alt="Godswill Uche — Product & UX Designer"
          className="hero__avatar-img"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* ── Text column ──────────────────── */}
      <div className="hero__body">

        {/* Row 1 — name / role / CTA */}
        <div className="hero__header">
          <div className="hero__text">
            <p className="hero__name">
              <TextType
                text="Godswill Uche"
                as="span"
                typingSpeed={70}
                initialDelay={300}
                loop={false}
                showCursor={false}
              />
            </p>
            <p className="hero__role">
              <TextType
                text={[
                  'Product Designer',
                  'UX Designer',
                  'Design Systems',
                  'Visual Designer',
                ]}
                as="span"
                typingSpeed={65}
                deletingSpeed={35}
                pauseDuration={2200}
                initialDelay={1400}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="hero__cursor"
              />
            </p>
          </div>
          <a
            className="hero__cta"
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
          >Download CV</a>
        </div>

        {/* Row 2 — bio */}
        <p className="hero__bio">
          Product Designer with hands-on experience in fintech, health tech, e-commerce,
          and social impact. Currently leading design at{' '}
          <Mention handle="@carlofty" href="https://www.carlofty.com" logoSrc={carloftyLogo} />
          {' '}— built a scalable design system (components, variables, tokens), conducted
          user and competitive research, and contributed to a product processing over{' '}
          <strong className="hero__emphasis">$6M</strong>
          {' '}in payments. Redesigned onboarding flows at{' '}
          <Mention handle="@Learnbeta" href="https://www.learnbeta.ng" logoSrc={learnbetaLogo} />
          {'. '}Led end-to-end product design for{' '}
          <Mention handle="@betacare" href="https://www.betacare.ng" />
          {' '}(health tech),{' '}
          <Mention handle="@betaplay" href="https://betaplay.ng/" />
          {' '}(lottery),{' '}
          <Mention handle="@twingle" href="https://www.twingle.ng/" />
          {' '}(dating), and{' '}
          <Mention handle="@madina" href="https://www.madina.ng" />
          {' '}(e-commerce). Delivered campaign and ad platform designs at{' '}
          <Mention handle="@valueplusagency" href="https://www.valueplusagency.com/" />
          {'. '}Collaborated cross-functionally at{' '}
          <Mention handle="@cosonas" href="https://cosonas.com/" />
          {' '}to ship multi-stakeholder products. Led UX/UI design for{' '}
          <Mention handle="@sheclusiveafrica" href="https://sheclusive.africa/" />
          {', '}an NGO driving women's digital empowerment across Africa. HNG Finalist —
          co-designed{' '}
          <Mention handle="@zeduchat" href="https://zedu.chat/" />
          {' '}(formerly Telex).
        </p>

      </div>
    </div>
  );
}
