import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'About Me' },
  { to: '/experience', label: 'Experience' },
  { to: '/coding-reference', label: 'Coding Reference' },
  { to: '/dogs', label: 'Dogs!' },
  { to: '/hobbies', label: 'Hobbies' },
  { to: '/contact', label: 'Contact Me' },
] as const;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const isCurrent = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="site-shell" style={{ ['--beach-image' as string]: "url('/assets/beach.jpg')" }}>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-brand" onClick={() => setNavOpen(false)}>
            <img
              className="site-brand__avatar"
              alt="Me!"
              src="/assets/professional_photo.jpg"
              width={40}
              height={40}
            />
            David Gorden
          </Link>
          <button
            type="button"
            className="site-nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-navigation"
            onClick={() => setNavOpen((open) => !open)}
          >
            Menu
          </button>
          <nav
            id="primary-navigation"
            className={`site-nav${navOpen ? ' is-open' : ''}`}
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="site-nav__link"
                aria-current={isCurrent(item.to) ? 'page' : undefined}
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="site-main" id="Content_Body">
        {children}
      </main>
    </div>
  );
};

export default Layout;
