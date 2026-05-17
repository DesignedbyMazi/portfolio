import { useEffect, useState } from 'react';
import './Footer.css';

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

function ArrowUpRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="footer__email-arrow"
    >
      <path
        d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="footer__globe"
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.5C12 2.5 8.5 6.5 8.5 12C8.5 17.5 12 21.5 12 21.5M12 2.5C12 2.5 15.5 6.5 15.5 12C15.5 17.5 12 21.5 12 21.5M2.5 12H21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Footer() {
  const now = useCurrentTime();

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
            <GlobeIcon />
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
