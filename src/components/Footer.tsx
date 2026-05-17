import { useEffect, useState } from 'react';
import './Footer.css';

/* ── Theme hook ──────────────────────────────────────── */
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark'; }
    catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    // Add transition class so all color changes animate smoothly
    root.classList.add('theme-transitioning');
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); }
    catch { /* ignore */ }
    const tid = setTimeout(() => root.classList.remove('theme-transitioning'), 400);
    return () => clearTimeout(tid);
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}

/* ── Clock hook ──────────────────────────────────────── */
function useCurrentTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Africa/Lagos',
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Africa/Lagos',
  });
}

/* ── Icons ───────────────────────────────────────────── */
function ArrowUpRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="footer__email-arrow">
      <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Filled sun — shown in light mode */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM12 19.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM21.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM4.75 12a.75.75 0 0 1-.75.75H2.5a.75.75 0 0 1 0-1.5H4a.75.75 0 0 1 .75.75ZM18.364 5.636a.75.75 0 0 1 0 1.061l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.062a.75.75 0 0 1 1.06 0ZM7.757 16.303a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.061 0ZM18.364 18.364a.75.75 0 0 1-1.06 0l-1.062-1.06a.75.75 0 0 1 1.061-1.062l1.06 1.061a.75.75 0 0 1 0 1.061ZM7.757 7.697a.75.75 0 0 1-1.061 0L5.635 6.636a.75.75 0 1 1 1.061-1.06l1.061 1.06a.75.75 0 0 1 0 1.061Z" />
    </svg>
  );
}

/** Filled crescent moon — shown in dark mode */
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────── */
export default function Footer() {
  const now             = useCurrentTime();
  const { isDark, toggle } = useTheme();

  return (
    <footer className="footer">
      <div className="footer__divider" />
      <div className="footer__content">

        <div className="footer__email-row">
          <span className="footer__label">Email</span>
          <div className="footer__email-link-wrap">
            <a href="mailto:designedbyuche@gmail.com" className="footer__email-link">
              designedbyuche@gmail.com
            </a>
            <ArrowUpRightIcon />
          </div>
        </div>

        <div className="footer__meta-row">
          <div className="footer__meta">
            {/* Theme toggle — sun in light mode, moon in dark mode */}
            <button
              className="footer__theme-toggle"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>

            <span className="footer__date">{formatDate(now)}</span>
            <span className="footer__sep">·</span>
            <span className="footer__time">
              {formatTime(now)}
              <span className="footer__tz"> (WAT)</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
