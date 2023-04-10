import React//, { useState, useEffect } 
from 'react';
import 'bulma/css/bulma.min.css';

export default function Nav() {
return (
<nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item" href="https://bulma.io"></a>
    <span className="navbar-item is-size-3">
        Harry Hamlin
      </span>

    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" className="navbar-menu">
    <div className="navbar-end">
      
      <a className="navbar-item" href="#header">
        Home
      </a>

      <a className="navbar-item" href="#aboutme">
        About Me
      </a>

      <a className="navbar-item" href="#portfolio">
        Portfolio
      </a>

      <a className="navbar-item" href="#contact">
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