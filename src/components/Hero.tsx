import profileImg from '../assets/images/profile.jpg';
import { useRef, useEffect } from 'react';
import './Hero.css';

const LONG_PRESS_MS = 380;      // hold duration before drag activates
const MOVE_CANCEL_PX = 8;       // cancel long-press if finger moves this far first
const SPRING_DURATION_MS = 620; // spring-back animation length

function useDragToReturn(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

    const activateDrag = () => {
      isDragging = true;
      el.classList.add('hero__avatar--dragging');
      // Brief scale-up feedback when drag mode kicks in
      el.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'scale(1.07)';
      el.style.zIndex = '50';
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      longPressTimer = setTimeout(activateDrag, LONG_PRESS_MS);
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!isDragging) {
        // Cancel long-press if the finger drifts before the timer fires
        if (Math.abs(dx) > MOVE_CANCEL_PX || Math.abs(dy) > MOVE_CANCEL_PX) {
          if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }
        }
        return;
      }

      e.preventDefault(); // block page scroll while dragging
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.07)`;
    };

    const onTouchEnd = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (!isDragging) return;

      isDragging = false;
      el.classList.remove('hero__avatar--dragging');

      // Spring back to origin with a slight bounce
      el.style.transition = `transform ${SPRING_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      el.style.transform = 'translate(0px, 0px) scale(1)';

      // After spring completes, clear inline styles so CSS takes back over
      cleanupTimer = setTimeout(() => {
        el.style.transition = '';
        el.style.transform = '';
        el.style.zIndex = '';
      }, SPRING_DURATION_MS + 50);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      if (longPressTimer) clearTimeout(longPressTimer);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, [ref]);
}

export default function Hero() {
  const avatarRef = useRef<HTMLDivElement>(null);
  useDragToReturn(avatarRef);

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
