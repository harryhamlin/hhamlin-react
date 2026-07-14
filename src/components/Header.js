import React from 'react';
import headshotPhoto from '../images/headshot-2.jpg';

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

export default function Header({ currentPage }) {
  if (currentPage === 'CV') return null;
  const meta = PAGE_META[currentPage] || PAGE_META.about;

  return (
    <header className="page-header">
      <div className="page-header-inner">
        <p className="page-header-eyebrow">{meta.eyebrow}</p>
        <div className="page-header-row">
          <h1 className="page-header-title">{meta.title}</h1>
          {currentPage === 'about' && (
            <img className="about-headshot" src={headshotPhoto} alt={meta.title} />
          )}
        </div>
        {meta.tagline && <p className="page-header-tagline">{meta.tagline}</p>}
      </div>
    </header>
  );
}
