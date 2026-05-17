import { useEffect } from 'react';

/**
 * Observes every [data-animate] element on the page.
 * Fires as soon as the element just enters the viewport
 * so the full translateY travel is visible.
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
        // Fire when just 5% of the element peeks into the viewport —
        // the animation starts while the element is still mostly offscreen,
        // making the slide-in clearly visible.
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
