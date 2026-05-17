import { useEffect } from 'react';

/**
 * Observes every [data-animate] element on the page.
 * When an element enters the viewport it receives the
 * 'anim-visible' class, triggering the CSS transition.
 * The optional data-delay attribute (ms) staggers items
 * within the same group.
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

          // Animate once only
          observer.unobserve(el);
        });
      },
      {
        // Fire when at least 12% of the element is visible
        threshold: 0.12,
        // Only trigger when element is 48px inside the viewport bottom edge
        rootMargin: '0px 0px -48px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
