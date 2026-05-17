import profileImg from '../assets/images/profile.jpg';
import './Hero.css';

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero__avatar" data-animate>
        <img src={profileImg} alt="Godswill Uche" className="hero__avatar-img" />
      </div>
      <div className="hero__info">
        <div className="hero__text">
          <p className="hero__name" data-animate>Godswill Uche</p>
          <p className="hero__role" data-animate>Product Designer</p>
        </div>
        <button className="hero__cta" data-animate>View works</button>
      </div>
    </div>
  );
}
