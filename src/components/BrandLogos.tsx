import carloftyLogo from '../assets/logos/carlofty.png';
import karsaLogo from '../assets/logos/karsa.png';
import logo3 from '../assets/logos/logo3.png';
import betaplayLogo from '../assets/logos/betaplay.png';
import learnbetaLogo from '../assets/logos/learnbeta.png';
import twingleLogo from '../assets/logos/twingle.png';
import valueplusLogo from '../assets/logos/valueplus.png';
import betacareLogo from '../assets/logos/betacare.png';
import './BrandLogos.css';

const row1 = [
  { src: carloftyLogo, alt: 'Carlofty', width: 87 },
  { src: karsaLogo, alt: 'Karsa', width: 67 },
  { src: logo3, alt: 'Brand', width: 48 },
  { src: betaplayLogo, alt: 'BetaPlay', width: 128 },
];

const row2 = [
  { src: learnbetaLogo, alt: 'LearnBeta', width: 73 },
  { src: twingleLogo, alt: 'Twingle', width: 83 },
  { src: valueplusLogo, alt: 'ValuePlus', width: 88 },
  { src: betacareLogo, alt: 'Betacare', width: 100 },
];

export default function BrandLogos() {
  return (
    <div className="brands">
      <p className="brands__label">Brands I've worked with:</p>
      <div className="brands__grid">
        <div className="brands__row">
          {row1.map((logo) => (
            <div key={logo.alt} className="brands__logo-wrap" style={{ width: logo.width }}>
              <img src={logo.src} alt={logo.alt} className="brands__logo" />
            </div>
          ))}
        </div>
        <div className="brands__row">
          {row2.map((logo) => (
            <div key={logo.alt} className="brands__logo-wrap" style={{ width: logo.width }}>
              <img src={logo.src} alt={logo.alt} className="brands__logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
