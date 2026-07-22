import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Re-run the scroll reveal on every route change.
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [location.pathname]);

  return (
    <>
      <Nav />
      <Header />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Body />} />
        <Route path="/climbing" element={<Climbing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cv" element={<CV />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
