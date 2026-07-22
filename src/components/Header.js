import React from 'react';
import { useLocation } from 'react-router-dom';
import headshotPhoto from '../images/headshot-2.jpg';

const PATH_TO_KEY = {
  '/': 'about',
  '/about': 'about',
  '/portfolio': 'portfolio',
  '/climbing': 'climbing',
  '/contact': 'contact',
  '/cv': 'cv',
};

const PAGE_META = {
  about: {
    eyebrow: 'Seattle, WA',
    title: 'Harry Hamlin',
    tagline: 'Operations executive, technical leader, and alpine guide.',
  },
  portfolio: {
    eyebrow: 'Selected work',
    title: 'Portfolio',
    tagline: 'Projects spanning operations systems, web development, and data modeling.',
  },
  climbing: {
    eyebrow: 'Expedition record',
    title: 'Climbing',
    tagline: 'A decade guiding climbers on some of the world’s highest and most technical peaks.',
  },
  contact: {
    eyebrow: 'Get in touch',
    title: 'Contact',
    tagline: null,
  },
};

export default function Header() {
  const { pathname } = useLocation();
  const key = PATH_TO_KEY[pathname] || 'about';

  if (key === 'cv') return null;
  const meta = PAGE_META[key];

  return (
    <header className="page-header">
      <div className="page-header-inner">
        <p className="page-header-eyebrow">{meta.eyebrow}</p>
        <div className="page-header-row">
          <h1 className="page-header-title">{meta.title}</h1>
          {key === 'about' && (
            <img className="about-headshot" src={headshotPhoto} alt={meta.title} />
          )}
        </div>
        {meta.tagline && <p className="page-header-tagline">{meta.tagline}</p>}
      </div>
    </header>
  );
}
