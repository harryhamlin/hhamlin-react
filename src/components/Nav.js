import React, { useState } from 'react';

const links = [
  { key: 'about',     label: 'About' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'contact',   label: 'Contact' },
  { key: 'CV',        label: 'CV' },
];

export default function Nav({ currentPage, pageChangeHandler }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (key) => {
    pageChangeHandler(key);
    setMenuOpen(false);
  };

  return (
    <nav className="site-nav" role="navigation" aria-label="main navigation">
      <span className="brand">Harry Hamlin</span>
      <button
        className="nav-burger"
        aria-label="toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span /><span />
      </button>
      <div className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map(({ key, label }) => (
          <button
            key={key}
            className={`nav-link${currentPage === key ? ' active' : ''}`}
            onClick={() => handleNav(key)}
          >
            {label}
          </button>
        ))}
        <a
          className="nav-link"
          href="https://harryhamlin.github.io/hhamlin/cvharryhamlin.html"
          
          target="_blank"
          rel="noreferrer"
        >
          PDF ↗
        </a>
      </div>
    </nav>
  );
}
