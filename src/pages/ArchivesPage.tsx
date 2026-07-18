import { useMemo } from 'react';
import Stack from '../components/Stack';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ArchivesPage.css';

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

export default function ArchivesPage({ onBack, onNavigate }: Props) {
  const photos = useMemo(() => shuffle(PHOTO_PATHS), []);

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
        pageLabel="Godswill Uche"
        showViewWorks
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
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
