import CircularGallery from '../components/CircularGallery';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './FunFactPage.css';

const FUNFACT_ITEMS = [
  { image: '/Funfact/01.jpg', text: "I wasn't born Nigerian" },
  { image: '/Funfact/02.jpg', text: 'I speak a bit French' },
  { image: '/Funfact/03.jpg', text: 'I love to travel' },
  { image: '/Funfact/04.jpg', text: 'Manchester United' },
  { image: '/Funfact/05.jpg', text: 'B.Sc Dental Technology' },
  { image: '/Funfact/06.jpg', text: 'Three Idiots' },
  { image: '/Funfact/07.jpg', text: "Messi's the GOAT" },
  { image: '/Funfact/08.jpg', text: 'Curious & Intelligent' },
  { image: '/Funfact/09.jpg', text: 'Sarcasm and Memes' },
  { image: '/Funfact/10.mov', text: "I'm quite a stepper" },
];

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function FunFactPage({ onBack, onNavigate }: Props) {
  const handleNav = (page: string) => {
    if (page === 'Home') onBack();
    else onNavigate(page);
  };

  return (
    <div className="funfact-page">
      <Navbar
        activePage="About Me"
        onNavigate={handleNav}
        pageLabel="Fun Facts"
        showViewWorks={false}
        onGoHome={onBack}
      />

      <main className="funfact-main">
        <button className="funfact-back-link" onClick={onBack} aria-label="Go back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Go back
        </button>

        <div className="funfact-gallery-area">
          <CircularGallery
            items={FUNFACT_ITEMS}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.03}
          />
        </div>
      </main>

      <div className="funfact-footer-wrap">
        <Footer />
      </div>
    </div>
  );
}
