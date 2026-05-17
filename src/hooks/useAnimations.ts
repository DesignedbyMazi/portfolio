import { useEffect } from 'react';

/**
 * Observes every [data-animate] element on the page.
 * When an element enters the viewport it gets the
 * 'anim-visible' class, triggering the CSS transition.
 * The optional data-delay attribute (in ms) staggers items
 * within the same section.
 */
export function useAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);

          setTimeout(() => {
            el.classList.add('anim-visible');
          }, delay);

          // Only animate once
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -24px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
