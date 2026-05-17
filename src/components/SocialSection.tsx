import whatsappIcon from '../assets/icons/whatsapp.png';
import xIcon from '../assets/icons/x.png';
import instagramIcon from '../assets/icons/instagram.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import './SocialSection.css';

export default function SocialSection() {
  return (
    <div className="social-section">
      <div className="social-section__left">
        <p className="social-section__label">My social media handles:</p>
        <div className="social-section__icons">
          <a href="#" aria-label="WhatsApp" className="social-section__icon-link">
            <img src={whatsappIcon} alt="WhatsApp" className="social-section__icon" />
          </a>
          <a href="#" aria-label="X / Twitter" className="social-section__icon-link">
            <img src={xIcon} alt="X" className="social-section__icon" />
          </a>
          <a href="#" aria-label="Instagram" className="social-section__icon-link">
            <img src={instagramIcon} alt="Instagram" className="social-section__icon" />
          </a>
          <a href="#" aria-label="LinkedIn" className="social-section__icon-link">
            <img src={linkedinIcon} alt="LinkedIn" className="social-section__icon" />
          </a>
        </div>
      </div>
      <button className="social-section__cv-btn">Download CV</button>
    </div>
  );
}
