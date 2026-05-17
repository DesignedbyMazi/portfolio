import { useEffect } from 'react';

/**
 * Observes every [data-animate] element on the page.
 * When an element enters the viewport it immediately receives
 * the 'anim-visible' class — no artificial delay, the CSS
 * transition handles the smooth appearance.
 */
export function useAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
