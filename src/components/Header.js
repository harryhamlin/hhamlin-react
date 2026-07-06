import React from 'react';

const PAGE_META = {
  about: {
    eyebrow: '47.6062° N, 122.3321° W — Seattle, WA',
    title: 'Harry Hamlin',
    tagline: 'Operations executive, technical leader, and alpine guide.',
  },
  portfolio: {
    eyebrow: 'Selected work',
    title: 'Portfolio',
    tagline: 'Projects spanning operations systems, web development, and data modeling.',
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
        <h1 className="page-header-title">{meta.title}</h1>
        {meta.tagline && <p className="page-header-tagline">{meta.tagline}</p>}
      </div>
    </header>
  );
}
