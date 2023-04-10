import React//, { useState, useEffect } 
from 'react';
import 'bulma/css/bulma.min.css';
import Nav from './components/Nav';
import Header from './components/Header';
import About from './components/About';
import Body from './components/Body';
import Contact from './components/Contact';
import Footer from './components/Footer';


export default function App() {
    return (
      <div>

              <Nav/>
              <Header/>
              <About />
              <Body />
              <Contact />
              <Footer />

      </div>
    );
  }
  
  