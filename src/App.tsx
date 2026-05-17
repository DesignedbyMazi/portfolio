import { useAnimations } from './hooks/useAnimations';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroCopy from './components/IntroCopy';
import SocialSection from './components/SocialSection';
import SelectedProjects from './components/SelectedProjects';
import BrandLogos from './components/BrandLogos';
import Footer from './components/Footer';
import './App.css';

function App() {
  useAnimations();

  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="content">
          {/* Hero — each sub-element animates individually */}
          <Hero />

          {/* IntroCopy — each paragraph has its own data-animate + stagger delay */}
          <IntroCopy />

          <div data-animate data-delay="0">
            <SocialSection />
          </div>

          <div data-animate data-delay="0">
            <SelectedProjects />
          </div>

          {/* 48px gap between projects and brands (override uniform content gap) */}
          <div data-animate data-delay="0" className="content__brands">
            <BrandLogos />
          </div>

          <div data-animate data-delay="0">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
