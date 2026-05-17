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
          <Hero />

          <IntroCopy />

          <div data-animate>
            <SocialSection />
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
