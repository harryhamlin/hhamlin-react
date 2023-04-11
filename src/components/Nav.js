import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

export default function Nav({ currentPage, pageChangeHandler}) {
  const [active, setActive] = useState(false);

return (
<nav className="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item" href="https://bulma.io"></a>
    <span className="navbar-item is-size-3">
        Harry Hamlin
      </span>
      <button
            onClick={() => {
              setActive(!active);
            }}
            // role="button"
            className={`navbar-burger ${active ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>

  <div id="nav-hhamlin" className={`navbar-menu ${active ? "is-active" : ""}`}>
    <div className="navbar-end">

      <a className="navbar-item" href="#about"  onClick ={() => pageChangeHandler('about')}>
        About Me
      </a>

      <a className="navbar-item" href="#portfolio" onClick ={() => pageChangeHandler('portfolio')}>
        Portfolio
      </a>

      <a className="navbar-item" href="#contact" onClick ={() => pageChangeHandler('contact')}>
        Contact Me
      </a>

      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          CV
        </a>

        <div className="navbar-dropdown">
          <a className="navbar-item">
            HTML
          </a>
          <a className="navbar-item">
            PDF
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
)}