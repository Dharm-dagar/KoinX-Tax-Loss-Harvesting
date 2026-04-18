import { useTheme } from '../../context/ThemeContext';
import './Header.css';

export default function Header() {
  const { dark, toggle } = useTheme();

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <a className="header__logo" href="/">
          <span className="logo-koin">Koin</span>
          <span className="logo-x">X</span>
          <sup className="logo-reg">®</sup>
        </a>

        {/* Nav links — hidden on mobile */}
        <nav className="header__nav" aria-label="Main navigation">
          {/* Removed nav links as per user request */}
        </nav>

        {/* Right controls */}
        <div className="header__right">
          <button
            className={`theme-btn ${dark ? 'theme-btn--dark' : ''}`}
            onClick={toggle}
            aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
            title={`Switch to ${dark ? 'light' : 'dark'} mode`}
          >
            <span className="theme-btn__track">
              <span className="theme-btn__thumb">
                {dark ? (
                  /* Moon icon */
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  /* Sun icon */
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </span>
            </span>
            <span className="theme-btn__label">{dark ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
