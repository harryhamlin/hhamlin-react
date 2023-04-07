import React//, { useState, useEffect } 
from 'react';
import 'bulma/css/bulma.min.css';

export default function Nav() {
return (
<nav className="navbar" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item" href="https://bulma.io"></a>

    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" className="navbar-menu">
    <div className="navbar-start">
      <a className="navbar-item">
        Home
      </a>

      <a className="navbar-item">
        About Me
      </a>

      <a className="navbar-item">
        Projects
      </a>

      <a className="navbar-item">
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