import { useEffect } from 'react';

/**
 * Bi-directional scroll reveal.
 *
 * • Element enters viewport  → transition plays, element slides in.
 * • Element leaves viewport  → class removed instantly (no transition)
 *   so it resets to the hidden/offset state and re-animates next time.
 *
 * This makes the effect consistent whether the user scrolls down or up.
 */
export function useAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            // Restore the CSS transition and animate in
            el.style.transition = '';
            el.classList.add('anim-visible');
          } else {
            // Kill transition so the reset is instant (no visible exit animation)
            el.style.transition = 'none';
            el.classList.remove('anim-visible');
            // Re-enable transition after two frames so the reset is committed
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.style.transition = '';
              });
            });
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
