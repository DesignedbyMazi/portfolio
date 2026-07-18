import { useMemo } from 'react';
import Stack from '../components/Stack';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ArchivesPage.css';

const PHOTO_PATHS = [
  '/archives/01.jpg',
  '/archives/02.jpg',
  '/archives/03.jpg',
  '/archives/04.jpg',
  '/archives/05.jpg',
  '/archives/06.jpg',
  '/archives/07.jpg',
  '/archives/08.jpg',
  '/archives/09.jpg',
  '/archives/10.jpg',
  '/archives/11.jpg',
  '/archives/12.jpg',
  '/archives/13.jpg',
  '/archives/14.jpg',
  '/archives/15.jpg',
  '/archives/16.jpg',
  '/archives/17.jpg',
  '/archives/18.jpg',
  '/archives/19.jpg',
  '/archives/20.jpg',
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
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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
