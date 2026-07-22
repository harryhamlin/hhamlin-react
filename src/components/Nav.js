import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/about',     label: 'About' },
  // { to: '/portfolio', label: 'Portfolio' },
  { to: '/climbing',  label: 'Climbing' },
  { to: '/contact',   label: 'Contact' },
  { to: '/cv',        label: 'CV' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Treat "/" as the About page for active styling.
  const activePath = pathname === '/' ? '/about' : pathname;

  return (
    <nav className="site-nav" role="navigation" aria-label="main navigation">
      <Link className="brand" to="/about">Harry Hamlin</Link>
      <button
        className="nav-burger"
        aria-label="toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span /><span />
      </button>
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map(({ to, label }) => (
          <Link
            key={to}
            className={`nav-link${activePath === to ? ' active' : ''}`}
            to={to}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        {/* <a
          className="nav-link"
          href="https://harryhamlin.github.io/hhamlin/cvharryhamlin.html"
          target="_blank"
          rel="noreferrer"
        >
          PDF ↗
        </a> */}
      </div>
    </nav>
  );
}
