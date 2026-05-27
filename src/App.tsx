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
import './App.css';

/* ── Welcome confetti — fires on every page load ── */
function useWelcomeConfetti() {
  useEffect(() => {
    // Small delay so the page is visually settled
    const tid = setTimeout(() => {
      const count = 120;
      const defaults = {
        origin: { y: 0.5 },
        zIndex: 9999,
        colors: ['#11AB2A', '#4ADE80', '#A3E635', '#FFFFFF', '#D1FAE5'],
      };

      // Left burst
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.6),
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.15, y: 0.55 },
        angle: 60,
      });

      // Right burst
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.6),
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.85, y: 0.55 },
        angle: 120,
      });

      // Center drift
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: Math.floor(count * 0.4),
          spread: 100,
          startVelocity: 25,
          gravity: 0.6,
          origin: { x: 0.5, y: 0.4 },
        });
      }, 200);
    }, 600);

    return () => clearTimeout(tid);
  }, []);
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'carlofty'>('home');
  useAnimations();
  useWelcomeConfetti();

  useEffect(() => {
    if (currentView === 'carlofty') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentView]);

  if (currentView === 'carlofty') {
    return <CarloftyCaseStudy onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="page">
      <Navbar />
      <main className="main">

        {/* Full-width carousel — sits right below the navbar, outside content padding */}
        <UIExploration />

        <div className="content">
          <Hero />

          <IntroCopy />

          <div data-animate>
            <SocialSection />
          </div>

          <div data-animate>
            <SelectedProjects onReadCaseStudy={() => setCurrentView('carlofty')} />
          </div>

          <div data-animate>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
