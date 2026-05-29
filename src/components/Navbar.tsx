import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Navbar.css';

const navLinks = ['Home', 'Work', 'Services', 'About Me'];

interface NavbarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

interface LineStyle {
  left: number;
  width: number;
  opacity: number;
}

export default function Navbar({ activePage = 'Home', onNavigate }: NavbarProps) {
  const [atBottom, setAtBottom] = useState(false);
  const [line, setLine] = useState<LineStyle>({ left: 0, width: 0, opacity: 0 });
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtBottom((prev) => {
        if (!prev && y > 80) return true;
        if (prev && y < 16) return false;
        return prev;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const moveTo = useCallback((linkName: string) => {
    const container = linksRef.current;
    if (!container) return;
    const wrap = container.querySelector<HTMLElement>(`[data-link="${linkName}"]`);
    if (!wrap) return;
    const cr = container.getBoundingClientRect();
    const wr = wrap.getBoundingClientRect();
    setLine({ left: wr.left - cr.left, width: wr.width, opacity: 1 });
  }, []);

  // Snap line to active page on mount and whenever activePage changes.
  // useLayoutEffect runs synchronously after DOM paint so the ref is
  // always set and getBoundingClientRect returns real values.
  useLayoutEffect(() => {
    moveTo(activePage);
  }, [activePage, moveTo]);

  return (
    <nav className={`navbar${atBottom ? ' navbar--bottom' : ''}`}>
      <div className="navbar__inner">
        <div
          className="navbar__links"
          ref={linksRef}
          onMouseLeave={() => moveTo(activePage)}
        >
          {navLinks.map((link) => (
            <div
              key={link}
              data-link={link}
              className={`navbar__link-wrap${link === activePage ? ' navbar__link-wrap--active' : ''}`}
              onMouseEnter={() => moveTo(link)}
            >
              <a
                href="#"
                className="navbar__link"
                onClick={(e) => { e.preventDefault(); onNavigate?.(link); }}
              >
                {link}
              </a>
            </div>
          ))}
          {/* Single line that slides between tabs */}
          <div
            className="navbar__sliding-line"
            style={{ left: line.left, width: line.width, opacity: line.opacity }}
          />
        </div>
        <div className="navbar__status">
          <span className="navbar__dot" />
          <span className="navbar__status-text">Available to work</span>
        </div>
      </div>
    </nav>
  );
}
