import { useEffect } from 'react';

/**
 * One-direction scroll reveal.
 *
 * When a [data-animate] element enters the viewport it plays its
 * reveal animation exactly once and is then unobserved — it never
 * resets or replays.  This prevents the "both directions at the same
 * time" glitch that bi-directional observers can show when you're
 * half-way through a tall section.
 */
export function useAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          el.classList.add('anim-visible');
          // Unobserve immediately — animation plays once and stays
          observer.unobserve(el);
        });
      },
      {
        // Fire when at least 8% of the element is in view.
        // Negative bottom margin means the trigger line is 48px
        // above the viewport bottom so sections reveal just before
        // they reach the fold — feels natural and never glitches.
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
