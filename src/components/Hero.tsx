import profileImg from '../assets/images/profile.jpg';
import { useRef, useEffect } from 'react';
import TextType from './TextType';
import './Hero.css';

/* ── Constants ───────────────────────────────────────── */
const LONG_PRESS_MS  = 380;
const MOVE_CANCEL_PX = 8;
const SPRING_MS      = 620;

/* ── Caret helpers ───────────────────────────────────── */

/** Returns the text node + char offset visually under (x, y). */
function caretAt(x: number, y: number): { node: Text; offset: number } | null {
  const doc = document as any;
  try {
    // Firefox / standard
    if (doc.caretPositionFromPoint) {
      const p = doc.caretPositionFromPoint(x, y);
      if (p?.offsetNode?.nodeType === Node.TEXT_NODE)
        return { node: p.offsetNode as Text, offset: p.offset };
    }
    // Chrome / Safari / WebKit
    if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(x, y);
      if (r?.startContainer?.nodeType === Node.TEXT_NODE)
        return { node: r.startContainer as Text, offset: r.startOffset };
    }
  } catch { /* ignore cross-origin or sandboxed errors */ }
  return null;
}

/** Finds the sentence boundaries inside `text` around character `offset`. */
function sentenceBounds(text: string, offset: number): [number, number] {
  // Walk backward to find end of previous sentence (. ! ?)
  let start = 0;
  for (let i = offset - 1; i > 0; i--) {
    if (/[.!?]/.test(text[i - 1]) && /\s/.test(text[i])) {
      start = i;
      while (start < text.length && /\s/.test(text[start])) start++; // skip space
      break;
    }
  }
  // Walk forward to find end of this sentence
  let end = text.length;
  for (let i = Math.max(start, offset); i < text.length; i++) {
    if (/[.!?]/.test(text[i])) { end = i + 1; break; }
  }
  return [start, end];
}

/* ── Sentence magnification ──────────────────────────── */

/**
 * Splits the text node at sentence boundaries, wraps the sentence in a
 * <span class="sentence-zoom">, and returns the span.
 */
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
    // Let the browser paint scale(1) first, then zoom on the next frame
    requestAnimationFrame(() => span.classList.add('sentence-zoom--active'));
    return span;
  } catch {
    return null; // bail if range crosses element boundaries
  }
}

/** Immediately removes the sentence span, merging text nodes back. */
function unwrapNow(span: HTMLElement) {
  const parent = span.parentNode;
  if (!parent) return;
  while (span.firstChild) parent.insertBefore(span.firstChild, span);
  parent.removeChild(span);
  parent.normalize(); // re-merge split text nodes
}

/** Animates zoom back to scale(1) then removes the span from the DOM. */
function unwrapAnimated(span: HTMLElement) {
  span.classList.remove('sentence-zoom--active');
  setTimeout(() => unwrapNow(span), 300); // matches CSS transition duration
}

/* ── Main hook ───────────────────────────────────────── */

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
        // Cancel long-press if finger drifts before timer fires
        if (Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) {
          if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        }
        return;
      }

      e.preventDefault(); // block page scroll while dragging
      el.style.transition = 'none';
      el.style.transform  = `translate(${dx}px, ${dy}px) scale(1.07)`;

      /* ── Sentence detection ── */

      // 1. Quick check — still on the same sentence span?
      const check = caretAt(t.clientX, t.clientY);
      if (check && currentSpan?.contains(check.node)) return;

      // 2. Moved off current sentence — remove span immediately so DOM is clean
      if (currentSpan) { unwrapNow(currentSpan); currentSpan = null; }

      // 3. Fresh caret query on the clean DOM
      const fresh = caretAt(t.clientX, t.clientY);
      if (!fresh || el.contains(fresh.node) || !fresh.node.textContent?.trim()) return;

      // 4. Wrap the new sentence
      currentSpan = wrapSentence(fresh);
    };

    const onTouchEnd = () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (!isDragging) return;

      isDragging = false;
      el.classList.remove('hero__avatar--dragging');

      // Animate the last magnified sentence back to normal
      if (currentSpan) { unwrapAnimated(currentSpan); currentSpan = null; }

      // Spring image back to origin
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
      if (currentSpan) unwrapNow(currentSpan); // force cleanup on unmount
    };
  }, [ref]);
}

/* ── Component ───────────────────────────────────────── */
export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);
  useDragMagnify(avatarRef);

  return (
    <div className="hero">
      <div className="hero__avatar" ref={avatarRef} data-animate>
        <img src={profileImg} alt="Godswill Uche — Product & UX Designer" className="hero__avatar-img" loading="eager" fetchPriority="high" />
      </div>
      <div className="hero__info">
        <div className="hero__text">
          <p className="hero__name" data-animate>
            <TextType
              text="Godswill Uche"
              as="span"
              typingSpeed={70}
              initialDelay={300}
              loop={false}
              showCursor={false}
            />
          </p>
          <p className="hero__role" data-animate>
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
        <button className="hero__cta" data-animate>View works</button>
      </div>
    </div>
  );
}
