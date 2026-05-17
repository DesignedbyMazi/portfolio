import { useEffect, useState } from 'react';
import arrowIcon from '../assets/icons/arrow-up-right2.png';
import sunIcon from '../assets/icons/sun.png';
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
  // Display in WAT (UTC+1) regardless of local timezone
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
            <img src={arrowIcon} alt="" className="footer__email-arrow" />
          </div>
        </div>
        <div className="footer__meta-row">
          <div className="footer__meta">
            <span className="footer__date">{formatDate(now)}</span>
            <span className="footer__sep">·</span>
            <span className="footer__time">
              {formatTime(now)}
              <span className="footer__tz"> (WAT)</span>
            </span>
            <img src={sunIcon} alt="" className="footer__sun" />
          </div>
        </div>
      </div>
    </footer>
  );
}
