import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAnimations } from './hooks/useAnimations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroCopy from './components/IntroCopy';
import SocialSection from './components/SocialSection';
import UIExploration from './components/UIExploration';
import SelectedProjects from './components/SelectedProjects';
import Footer from './components/Footer';
import CarloftyCaseStudy from './pages/CarloftyCaseStudy';
import WorksPage from './pages/WorksPage';
import ServicesPage from './pages/ServicesPage';
import './App.css';

/* ── Welcome confetti — fires on every page load ── */
function useWelcomeConfetti() {
  useEffect(() => {
    const tid = setTimeout(() => {
      const count = 120;
      const defaults = {
        origin: { y: 0.5 },
        zIndex: 9999,
        colors: ['#11AB2A', '#4ADE80', '#A3E635', '#FFFFFF', '#D1FAE5'],
      };
      confetti({ ...defaults, particleCount: Math.floor(count * 0.6), spread: 70, startVelocity: 45, origin: { x: 0.15, y: 0.55 }, angle: 60 });
      confetti({ ...defaults, particleCount: Math.floor(count * 0.6), spread: 70, startVelocity: 45, origin: { x: 0.85, y: 0.55 }, angle: 120 });
      setTimeout(() => {
        confetti({ ...defaults, particleCount: Math.floor(count * 0.4), spread: 100, startVelocity: 25, gravity: 0.6, origin: { x: 0.5, y: 0.4 } });
      }, 200);
    }, 600);
    return () => clearTimeout(tid);
  }, []);
}

type View = 'home' | 'works' | 'services' | 'carlofty';

function App() {
  const [view, setView]                       = useState<View>('home');
  const [worksMounted,    setWorksMounted]    = useState(false);
  const [servicesMounted, setServicesMounted] = useState(false);
  const [carloftyMounted, setCarloftyMounted] = useState(false);
  // Tracks which view to return to when leaving Carlofty
  const [carloftyReturn, setCarloftyReturn] = useState<'home' | 'works'>('home');

  useAnimations();
  useWelcomeConfetti();

  const nav = (to: View) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setView(to);
  };

  const goHome     = () => nav('home');
  const goWorks    = () => { setWorksMounted(true);    nav('works');    };
  const goServices = () => { setServicesMounted(true); nav('services'); };
  const goCarlofty = (returnTo: 'home' | 'works' = 'works') => {
    setCarloftyMounted(true);
    setCarloftyReturn(returnTo);
    nav('carlofty');
  };
  const goBack = () => nav(carloftyReturn);

  /* Shared cross-page nav handler */
  const handleNav = (page: string) => {
    if (page === 'Home')     goHome();
    if (page === 'Work')     goWorks();
    if (page === 'Services') goServices();
  };

  return (
    <>
      {/* ── Home ─────────────────────────────────────────── */}
      <div className="page" style={{ display: view === 'home' ? undefined : 'none' }}>
        <Navbar onNavigate={handleNav} />
        <main className="main">
          <UIExploration />
          <div className="content">
            <Hero onViewWorks={goWorks} />
            <IntroCopy />
            <div data-animate><SocialSection /></div>
            <div data-animate>
              <SelectedProjects onReadCaseStudy={() => goCarlofty('home')} />
            </div>
            <div data-animate><Footer /></div>
          </div>
        </main>
      </div>

      {/* ── Works ─────────────────────────────────────────── */}
      {worksMounted && (
        <div style={{ display: view === 'works' ? undefined : 'none' }}>
          <WorksPage
            onBack={goHome}
            onReadCaseStudy={() => goCarlofty('works')}
            onNavigate={handleNav}
          />
        </div>
      )}

      {/* ── Services ──────────────────────────────────────── */}
      {servicesMounted && (
        <div style={{ display: view === 'services' ? undefined : 'none' }}>
          <ServicesPage onBack={goHome} onNavigate={handleNav} />
        </div>
      )}

      {/* ── Carlofty ──────────────────────────────────────── */}
      {carloftyMounted && (
        <div style={{ display: view === 'carlofty' ? undefined : 'none' }}>
          <CarloftyCaseStudy onBack={goBack} />
        </div>
      )}
    </>
  );
}

export default App;
