import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntroCopy from './components/IntroCopy';
import SocialSection from './components/SocialSection';
import SelectedProjects from './components/SelectedProjects';
import BrandLogos from './components/BrandLogos';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="page">
      <Navbar />
      <main className="main">
        <div className="content">
          <Hero />
          <IntroCopy />
          <SocialSection />
          <SelectedProjects />
          <BrandLogos />
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
