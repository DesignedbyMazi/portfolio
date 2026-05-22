import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAnimations } from './hooks/useAnimations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroCopy from './components/IntroCopy';
import SocialSection from './components/SocialSection';
import UIExploration from './components/UIExploration';
import SelectedProjects from './components/SelectedProjects';
import BrandLogos from './components/BrandLogos';
import Footer from './components/Footer';
import './App.css';

/* ── Welcome confetti — fires once per session ── */
function useWelcomeConfetti() {
  useEffect(() => {
    const key = 'portfolio-welcomed';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

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
  useAnimations();
  useWelcomeConfetti();

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="content">
          <Hero />

          <IntroCopy />

          <div data-animate>
            <SocialSection />
          </div>

          <div data-animate>
            <UIExploration />
          </div>

          <div data-animate>
            <SelectedProjects />
          </div>

          <div data-animate className="content__brands">
            <BrandLogos />
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
