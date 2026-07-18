import { useState, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OptionWheel from '../components/OptionWheel';
import ArchivesPage from './ArchivesPage';
import './AboutPage.css';

const WHEEL_ITEMS = [
  'About Uche',
  "Uche's Archives",
  "Uche's Music Taste",
  'Fun Fact About Uche',
];

/* Maps wheel index → which sub-page to open (null = not yet built) */
const PAGE_MAP: Record<number, 'archives' | null> = {
  1: 'archives',
};

interface Props {
  onBack:     () => void;
  onNavigate: (page: string) => void;
}

type SubPage = 'archives' | null;

export default function AboutPage({ onBack, onNavigate }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [subPage,  setSubPage]  = useState<SubPage>(null);
  const [bursting, setBursting] = useState(false);

  /* Track theme for OptionWheel color props */
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const s = localStorage.getItem('portfolio-theme');
      if (s === 'dark' || s === 'light') return s;
    } catch {}
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (next === 'dark' || next === 'light') setTheme(next);
    };
    window.addEventListener('portfolio-theme', handler);
    return () => window.removeEventListener('portfolio-theme', handler);
  }, []);

  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
    else onNavigate(page);
  };

  /* Synthesise a short descending-sine click using Web Audio API */
  const synthTick = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx  = new AudioCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.032);
      gain.gain.setValueAtTime(0.055, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.048);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
      setTimeout(() => ctx.close(), 300);
    } catch {}
  }, []);

  /* Called when an item on the wheel is clicked */
  const handleItemClick = useCallback((index: number) => {
    const target = PAGE_MAP[index];
    if (!target) return;
    /* Burst → then mount sub-page */
    setBursting(true);
    setTimeout(() => {
      setBursting(false);
      setSubPage(target);
    }, 420);
  }, []);

  const handleSubPageBack = () => setSubPage(null);

  const textColor   = theme === 'dark' ? 'rgba(200,200,205,0.42)' : 'rgba(80,80,90,0.42)';
  const activeColor = theme === 'dark' ? '#FFFFFF'                 : '#0F0F0F';

  return (
    <>
      <div className="about-page">
        <Navbar
          activePage="About Me"
          onNavigate={handleNav}
          pageLabel="About Me"
          showViewWorks={false}
          onGoHome={onBack}
        />

        <div className="about-main">
          <div className="about-wheel-wrap">
            <OptionWheel
              items={WHEEL_ITEMS}
              defaultSelected={0}
              fontSize={36 / 15}          /* 36 px at 15 px root */
              side="left"
              spacing={1.55}
              curve={0.85}
              tilt={5}
              blur={1.6}
              fade={0.28}
              minOpacity={0.05}
              smoothing={180}
              inset={0}
              textColor={textColor}
              activeColor={activeColor}
              loop={false}
              draggable
              onTick={synthTick}
              onChange={(index) => setSelectedIdx(index)}
              onItemClick={handleItemClick}
            />
          </div>

          {/* Right panel — future content per wheel item */}
          <div className="about-panel" data-section={selectedIdx} />
        </div>
      </div>

      {/* Burst overlay — plays before sub-page mounts */}
      {bursting && <div className="about-burst" />}

      {/* Sub-pages */}
      {subPage === 'archives' && (
        <ArchivesPage onBack={handleSubPageBack} onNavigate={onNavigate} />
      )}
    </>
  );
}
