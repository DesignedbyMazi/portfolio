import { useMemo, useCallback, Suspense, lazy } from 'react';
import Stack from '../components/Stack';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ArchivesPage.css';

const Antigravity = lazy(() => import('../components/Antigravity'));

/* Capital "A" matches the /public/Archives/ folder exactly — Linux/Vercel is case-sensitive */
const PHOTO_PATHS = [
  '/Archives/01.jpg',
  '/Archives/02.jpg',
  '/Archives/03.jpg',
  '/Archives/04.jpg',
  '/Archives/09.jpg',
  '/Archives/10.jpg',
  '/Archives/11.jpg',
  '/Archives/12.jpg',
  '/Archives/13.jpg',
  '/Archives/14.jpg',
  '/Archives/15.jpg',
  '/Archives/16.jpg',
  '/Archives/17.jpg',
  '/Archives/18.jpg',
  '/Archives/19.jpg',
  '/Archives/20.jpg',
  '/Archives/21.jpg',
  '/Archives/22.jpg',
  '/Archives/23.jpg',
  '/Archives/24.jpg',
];

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function synthBubblePop() {
  try {
    const Ctx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
    setTimeout(() => ctx.close(), 300);
  } catch { /* ignore */ }
}

export default function ArchivesPage({ onBack, onNavigate }: Props) {
  const photos = useMemo(() => shuffle(PHOTO_PATHS), []);
  const handleSwipe = useCallback(() => synthBubblePop(), []);

  const cards = photos.map((src, i) => (
    <img
      key={i}
      src={src}
      alt={`archive-${i + 1}`}
      className="card-image"
      draggable={false}
    />
  ));

  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
    else onNavigate(page);
  };

  return (
    <div className="archives-page">
      <Navbar
        activePage="About Me"
        onNavigate={handleNav}
        pageLabel="Uche's Archives"
        showViewWorks={false}
        onGoHome={onBack}
      />

      <main className="archives-main">
        <button className="archives-back-link" onClick={onBack} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go back
        </button>

        <div className="archives-stack-area">
          <div className="archives-stack-wrap">
            <Stack
              cards={cards}
              randomRotation
              sensitivity={120}
              sendToBackOnClick
              animationConfig={{ stiffness: 280, damping: 22 }}
              onCardSwiped={handleSwipe}
              topCardOverlay={
                <Suspense fallback={null}>
                  <Antigravity
                    count={180}
                    magnetRadius={8}
                    ringRadius={5}
                    waveSpeed={0.5}
                    waveAmplitude={0.9}
                    particleSize={1.4}
                    lerpSpeed={0.06}
                    color="#ffffff"
                    autoAnimate
                    particleVariance={0.8}
                    pulseSpeed={2.5}
                    fieldStrength={9}
                    rotationSpeed={0.08}
                  />
                </Suspense>
              }
            />
          </div>
        </div>
      </main>

      <div className="archives-footer-wrap">
        <Footer />
      </div>
    </div>
  );
}
