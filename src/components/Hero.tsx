import profileImg from '../assets/images/profile.jpg';
import './Hero.css';

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__avatar">
        <img src={profileImg} alt="Godswill Uche" className="hero__avatar-img" />
      </div>
      <div className="hero__info">
        <div className="hero__text">
          <p className="hero__name">Godswill Uche</p>
          <p className="hero__role">Product Designer</p>
        </div>
        <button className="hero__cta">View works</button>
      </div>
    </div>
  );
}
