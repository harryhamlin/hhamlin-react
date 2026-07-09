import React, { useState, useEffect } from 'react';
import './site.css';
import Nav from './components/Nav';
import Header from './components/Header';
import About from './components/About';
import Body from './components/Body';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CV from './components/CV';
import Climbing from './components/Climbing';

export default function App() {
  const [currentPage, setCurrentPage] = useState('about');

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [currentPage]);

  const renderPage = () => {
    if (currentPage === 'about') return <About />;
    if (currentPage === 'portfolio') return <Body />;
    if (currentPage === 'climbing') return <Climbing />;
    if (currentPage === 'contact') return <Contact />;
    if (currentPage === 'CV') return <CV />;
  };

  return (
    <>
      <Nav currentPage={currentPage} pageChangeHandler={setCurrentPage} />
      <Header currentPage={currentPage} />
      {renderPage()}
      <Footer />
    </>
  );
}
