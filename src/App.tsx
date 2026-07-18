import { useEffect, useRef, useState } from 'react';
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
import AboutPage from './pages/AboutPage';
import './App.css';

/* ── Global click spark overlay — fires on every click, any page ── */
function GlobalSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Array<{ x: number; y: number; angle: number; startTime: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleClick = (e: MouseEvent) => {
      const now = performance.now();
      const count = 8;
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / count,
          startTime: now,
        });
      }
    };
    document.addEventListener('click', handleClick);

    const ctx = canvas.getContext('2d')!;
    const DURATION   = 420;
    const RADIUS     = 20;
    const LINE_SIZE  = 8;
    let animId: number;

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed = ts - spark.startTime;
        if (elapsed >= DURATION) return false;
        const t      = elapsed / DURATION;
        const eased  = t * (2 - t);          // ease-out
        const dist   = eased * RADIUS;
        const len    = LINE_SIZE * (1 - eased);
        const x1 = spark.x + dist * Math.cos(spark.angle);
        const y1 = spark.y + dist * Math.sin(spark.angle);
        const x2 = spark.x + (dist + len) * Math.cos(spark.angle);
        const y2 = spark.y + (dist + len) * Math.sin(spark.angle);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.70)' : 'rgba(60,60,60,0.55)';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        99999,
      }}
    />
  );
}

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

type View = 'home' | 'works' | 'services' | 'carlofty' | 'about';

function App() {
  const [view, setView]                       = useState<View>('home');
  const [worksMounted,    setWorksMounted]    = useState(false);
  const [servicesMounted, setServicesMounted] = useState(false);
  const [carloftyMounted, setCarloftyMounted] = useState(false);
  const [aboutMounted,    setAboutMounted]    = useState(false);
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
  const goAbout    = () => { setAboutMounted(true);    nav('about');    };
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
    if (page === 'About Me') goAbout();
  };

  return (
    <>
      <GlobalSpark />

      {/* ── Home ─────────────────────────────────────────── */}
      <div className="page" style={{ display: view === 'home' ? undefined : 'none' }}>
        <Navbar onNavigate={handleNav} pageLabel="Godswill Uche" showViewWorks onGoHome={goHome} />
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
          <CarloftyCaseStudy onBack={goBack} onNavigate={handleNav} onGoHome={goHome} />
        </div>
      )}

      {/* ── About ─────────────────────────────────────────── */}
      {aboutMounted && (
        <div style={{ display: view === 'about' ? undefined : 'none' }}>
          <AboutPage onBack={goHome} onNavigate={handleNav} />
        </div>
      )}
    </>
  );
}

export default App;
