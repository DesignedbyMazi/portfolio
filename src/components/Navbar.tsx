import { useEffect, useState } from 'react';
import './Navbar.css';

const navLinks = ['Home', 'Work', 'Services', 'About Me'];

interface NavbarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export default function Navbar({ activePage = 'Home', onNavigate }: NavbarProps) {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtBottom((prev) => {
        if (!prev && y > 80) return true;   // slip to bottom after 80px scroll
        if (prev  && y < 16) return false;  // snap back to top near the very top
        return prev;                         // hysteresis — no change in between
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${atBottom ? ' navbar--bottom' : ''}`}>
      <div className="navbar__inner">
        <div className="navbar__links">
          {navLinks.map((link) => (
            <div
              key={link}
              className={`navbar__link-wrap ${link === activePage ? 'navbar__link-wrap--active' : ''}`}
            >
              <a
                href="#"
                className="navbar__link"
                onClick={(e) => { e.preventDefault(); onNavigate?.(link); }}
              >
                {link}
              </a>
              <div className="navbar__underline" />
            </div>
          ))}
        </div>
        <div className="navbar__status">
          <span className="navbar__dot" />
          <span className="navbar__status-text">Available to work</span>
        </div>
      </div>
    </nav>
  );
}
