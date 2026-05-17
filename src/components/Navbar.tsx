import './Navbar.css';

const navLinks = ['Home', 'Work', 'Services', 'About Me'];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__links">
          {navLinks.map((link) => (
            <div key={link} className={`navbar__link-wrap ${link === 'Home' ? 'navbar__link-wrap--active' : ''}`}>
              <a href="#" className="navbar__link">{link}</a>
              <div className="navbar__underline" />
            </div>
          ))}
        </div>
        <div className="navbar__status">
          <span className="navbar__dot" />
          <span className="navbar__status-text">Available to work</span>
        </div>
      </div>
    </nav>
  );
}
