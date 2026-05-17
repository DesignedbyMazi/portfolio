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
          {/* Hero — first element on screen, no delay */}
          <div data-animate data-delay="0">
            <Hero />
          </div>

          {/* Intro copy — each paragraph staggers via the component */}
          <div data-animate data-delay="60">
            <IntroCopy />
          </div>

          <div data-animate data-delay="0">
            <SocialSection />
          </div>

          <div data-animate data-delay="0">
            <SelectedProjects />
          </div>

          <div data-animate data-delay="0">
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
