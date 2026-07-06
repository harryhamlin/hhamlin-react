import React from 'react';
import Card from './Card';
import photo from '../images/cherryblossoms.jpg';

const projects = [
  {
    title: 'Client Registration System',
    tags: 'AirTable · DocuSign · Zapier · JavaScript',
    description: 'Multi-platform registration and payment system with concurrency handling for high-demand program releases.',
    href: 'https://www.github.com/harryhamlin',
    repo: 'https://www.github.com/harryhamlin',
    image: photo,
    imageAlt: 'Registration system',
  },
  {
    title: 'Payroll Forecast Model',
    tags: 'Excel · Data modeling · Labor analytics',
    description: 'Real-time scheduling monitor forecasting weekly payroll within ±5% of actual costs.',
    href: 'https://www.github.com/harryhamlin',
    repo: 'https://www.github.com/harryhamlin',
    image: photo,
    imageAlt: 'Payroll forecast model',
  },
  {
    title: 'Portfolio Site',
    tags: 'React · JavaScript · CSS',
    description: 'This site — a single-page React application with a custom design system.',
    href: 'https://www.github.com/harryhamlin',
    repo: 'https://www.github.com/harryhamlin',
    image: photo,
    imageAlt: 'Portfolio site',
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
