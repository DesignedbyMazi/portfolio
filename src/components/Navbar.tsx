import { useEffect, useState } from 'react';
import profileImg from '../assets/images/profile.jpg';
import GlareHover from './GlareHover';
import ClickSpark from './ClickSpark';
import './Navbar.css';

interface NavbarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

/* ── Inline icon components (stroke="currentColor") ── */
function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 17.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8.49878 6.50012C8.49878 5.09566 8.49878 4.39343 8.83584 3.88898C8.98176 3.6706 9.16926 3.4831 9.38764 3.33718C9.89208 3.00012 10.5943 3.00012 11.9988 3.00012C13.4033 3.00012 14.1055 3.00012 14.6099 3.33718C14.8283 3.4831 15.0158 3.6706 15.1617 3.88898C15.4988 4.39343 15.4988 5.09566 15.4988 6.50012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.9981 6.50028L3.99898 6.50012C2.89452 6.50019 1.99888 7.3958 1.99878 8.50025C1.99888 10.7092 3.79017 12.5005 5.99913 12.5007H17.998C20.2069 12.5006 21.9981 10.7094 21.9982 8.50042C21.9982 7.39594 21.1026 6.50036 19.9981 6.50028Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.49878 11.0001V14.0001M16.4988 14.0001V11.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.00102 8.50012L1.99887 13.9971C1.99758 17.298 1.99693 18.9485 3.02211 19.9741C4.04729 20.9997 5.69777 20.9998 8.99871 20.9998L14.9998 21C18.2991 21 19.9488 21.0001 20.9739 19.9752C21.999 18.9503 21.9993 17.3006 22 14.0013L22.001 8.50012" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PaintIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8417 22 14 22.1163 14 21C14 20.391 13.6832 19.9212 13.3686 19.4544C12.9082 18.7715 12.4523 18.0953 13 17C13.6667 15.6667 14.7778 15.6667 16.4815 15.6667C17.3334 15.6667 18.3334 15.6667 19.5 15.5C21.601 15.1999 22 13.9084 22 12Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 10C10.3284 10 11 9.32843 11 8.5C11 7.67157 10.3284 7 9.5 7C8.67157 7 8 7.67157 8 8.5C8 9.32843 8.67157 10 9.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16.5 11C17.3284 11 18 10.3284 18 9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5C15 10.3284 15.6716 11 16.5 11Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7.125 15H7M7.25 15C7.25 15.1381 7.13807 15.25 7 15.25C6.86193 15.25 6.75 15.1381 6.75 15C6.75 14.8619 6.86193 14.75 7 14.75C7.13807 14.75 7.25 14.8619 7.25 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14C7 14 4 16.5 4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19C20 16.5 17 14 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Tab config ── */
const NAV_TABS = [
  { key: 'Home',     label: 'Home',     Icon: HomeIcon      },
  { key: 'Work',     label: 'Work',     Icon: BriefcaseIcon },
  { key: 'Services', label: 'Services', Icon: PaintIcon      },
  { key: 'About Me', label: 'About Me', Icon: UserIcon       },
] as const;

const TEXT_LINKS = ['Home', 'Work', 'Services', 'About Me'] as const;

export default function Navbar({ activePage = 'Home', onNavigate }: NavbarProps) {
  const [floated, setFloated] = useState(false);
  const [theme,   setTheme]   = useState<'light' | 'dark'>('light');

  /* Detect scroll past hero via IntersectionObserver */
  useEffect(() => {
    const heroEl = document.querySelector('.hero');
    if (!heroEl) { setFloated(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => setFloated(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  /* Sync theme from DOM on mount */
  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') setTheme(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  /* Spark color adapts to theme for readability */
  const sparkColor = theme === 'dark' ? '#ffffff' : '#555555';

  return (
    <>
      {/* ── Original sticky top bar — fades out when floated ── */}
      <nav className={`navbar${floated ? ' navbar--hidden' : ''}`}>
        <div className="navbar__inner">
          <div className="navbar__links">
            {TEXT_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className={`navbar__link${link === activePage ? ' navbar__link--active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate?.(link); }}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="navbar__status">
            <span className="navbar__dot" />
            <span className="navbar__status-text">Available to work</span>
          </div>
        </div>
      </nav>

      {/* ── Floating top header — Dynamic Island morph ── */}
      <div
        className={`float-header${floated ? ' float-header--visible' : ''}`}
        role="banner"
      >
        <div className="float-header__left">
          <img src={profileImg} alt="" className="float-header__avatar" aria-hidden />
          <span className="float-header__name">Godswill Uche</span>
        </div>
        <div className="float-header__right">
          <button
            className="float-header__cta"
            onClick={() => onNavigate?.('Work')}
          >
            View works
          </button>
          <button
            className="float-header__theme"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <SunIcon />
          </button>
        </div>
      </div>

      {/* ── Floating bottom icon nav ── */}
      <nav
        className={`float-nav${floated ? ' float-nav--visible' : ''}`}
        aria-label="Main navigation"
      >
        {/* ClickSpark fires on any click inside the pill */}
        <ClickSpark
          sparkColor={sparkColor}
          sparkSize={7}
          sparkRadius={18}
          sparkCount={6}
          duration={380}
        >
          {/* This div carries the flex layout that ClickSpark's wrapper div can't */}
          <div className="float-nav__tabs">
            {NAV_TABS.map(({ key, label, Icon }) => {
              const isActive = activePage === key;
              return (
                <button
                  key={key}
                  className={`float-nav__tab${isActive ? ' float-nav__tab--active' : ''}`}
                  onClick={() => onNavigate?.(key)}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* GlareHover adds sweep glare on hover */}
                  <GlareHover
                    width="100%"
                    height="100%"
                    background="transparent"
                    borderRadius="9999px"
                    borderColor="transparent"
                    glareColor="#ffffff"
                    glareOpacity={0.28}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={600}
                  >
                    <Icon />
                  </GlareHover>
                </button>
              );
            })}
          </div>
        </ClickSpark>
      </nav>
    </>
  );
}
