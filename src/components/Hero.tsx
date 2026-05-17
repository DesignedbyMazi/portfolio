import profileImg from '../assets/images/profile.jpg';
import { useRef, useEffect } from 'react';
import './Hero.css';

/* ── Constants ───────────────────────────────────────── */
const LONG_PRESS_MS    = 380;   // hold time before drag activates
const MOVE_CANCEL_PX   = 8;    // drift threshold that cancels the long-press
const SPRING_MS        = 620;   // spring-back duration on release

/* Block-level text tags worth magnifying */
const TEXT_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5']);

/* ── Magnify helpers ─────────────────────────────────── */

/** Find the deepest block-level text element at (x, y), skipping `exclude`. */
function textUnder(x: number, y: number, exclude: Element): HTMLElement | null {
  const hits = document.elementsFromPoint(x, y) as HTMLElement[];
  for (const el of hits) {
    if (el === exclude || exclude.contains(el)) continue;
    // Direct block text hit
    if (TEXT_TAGS.has(el.tagName) && el.textContent?.trim()) return el;
    // Inline child (span / strong / a) → climb to its block parent
    const block = el.closest('p,h1,h2,h3,h4,h5') as HTMLElement | null;
    if (block && block.textContent?.trim()) return block;
  }
  return null;
}

/** Scale the element up — bounce spring for a lively feel. */
function magnify(el: HTMLElement) {
  // Cancel any in-flight shrink for this element
  const pending = (el as any).__shrinkTimer as ReturnType<typeof setTimeout> | undefined;
  if (pending) { clearTimeout(pending); (el as any).__shrinkTimer = null; }

  el.style.transition = 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)';
  el.style.transform   = 'scale(1.13)';
  el.style.transformOrigin = 'left center';
  el.style.position    = 'relative';
  el.style.zIndex      = '5';
}

/** Scale the element back and clear inline styles once done. */
function shrink(el: HTMLElement) {
  el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  el.style.transform  = 'scale(1)';

  const tid = setTimeout(() => {
    el.style.transition      = '';
    el.style.transform       = '';
    el.style.transformOrigin = '';
    el.style.position        = '';
    el.style.zIndex          = '';
    (el as any).__shrinkTimer = null;
  }, 340);
  (el as any).__shrinkTimer = tid;
}

/* ── Main hook ───────────────────────────────────────── */
function useDragMagnify(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDragging  = false;
    let startX      = 0;
    let startY      = 0;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupTimer:   ReturnType<typeof setTimeout> | null = null;
    let magnifiedEl:    HTMLElement | null = null;

    /* Activate drag mode — subtle scale-up signals to the user */
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
        // Cancel long-press if finger drifts too far before timer fires
        if (Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) {
          if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
        }
        return;
      }

      e.preventDefault(); // prevent page scroll while dragging

      /* Move the image with the finger */
      el.style.transition = 'none';
      el.style.transform  = `translate(${dx}px, ${dy}px) scale(1.07)`;

      /* ── Text magnification ── */
      const target = textUnder(t.clientX, t.clientY, el);

      if (target !== magnifiedEl) {
        // Un-magnify the element we just left
        if (magnifiedEl) shrink(magnifiedEl);
        // Magnify the new element
        if (target) magnify(target);
        magnifiedEl = target;
      }
    };

    const onTouchEnd = () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (!isDragging) return;

      isDragging = false;
      el.classList.remove('hero__avatar--dragging');

      /* Shrink whichever text is still magnified */
      if (magnifiedEl) { shrink(magnifiedEl); magnifiedEl = null; }

      /* Spring the image back to its origin */
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
        <img src={profileImg} alt="Godswill Uche" className="hero__avatar-img" />
      </div>
      <div className="hero__info">
        <div className="hero__text">
          <p className="hero__name" data-animate>Godswill Uche</p>
          <p className="hero__role" data-animate>Product Designer</p>
        </div>
        <button className="hero__cta" data-animate>View works</button>
      </div>
    </div>
  );
}
