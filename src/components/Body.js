import React from 'react';
import Card from './Card';
import powdertrace from '../images/powdertrace.png';
import torchsnuffers from '../images/torchsnuffers.png';

const projects = [
  {
    title: 'Powder Trace',
    tags: 'SMS · Weather APIs · AI summarization',
    description: 'SMS-based mountain weather service for backcountry travelers with limited connectivity — text a command, get an on-demand forecast, no app or account required.',
    href: 'https://powdertrace.com',
    image: powdertrace,
    imageAlt: 'Powder Trace homepage',
  },
  {
    title: 'Torch Snuffers',
    tags: 'Fantasy sports · Auth · Leaderboards',
    description: 'Fantasy competition platform for Survivor, with player leaderboards, scoring, and account management.',
    href: 'https://torchsnuffers.com',
    image: torchsnuffers,
    imageAlt: 'Torch Snuffers leaderboard',
  },
];

export default function Body() {
  return (
    <main className="page-main" id="portfolio">
      <section className="page-section reveal">
        <p className="section-label">Projects</p>
        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <Card key={i} {...p} />
          ))}
        </div>
      </section>
    </main>
  );
}
