import React from 'react';

export default function About() {
  return (
    <main className="page-main" id="about">
      <section className="page-section reveal">
        <p className="section-label">Background</p>
        <p>
          I spent a decade leading climbers on the world's highest peaks before taking over
          day-to-day leadership of International Mountain Guides — one of the most renowned
          guide services in the world — through the pandemic and the growth years beyond.
          As General Manager, I run a 40+ person operation while personally architecting the
          company's registration, payments, and labor-forecasting infrastructure.
        </p>
        <p style={{ marginTop: '18px' }}>
          That combination is the through-line of my career: high-consequence leadership
          paired with hands-on systems building. I write production JavaScript, design data
          models, and use AI tools daily — for code, for marketing content, for customer
          communications, and for the analytical models that drive pricing and payroll
          decisions.
        </p>
        <p style={{ marginTop: '18px' }}>
          Outside work: mountain biking, traveling, cooking, and finding new routes up old peaks.
        </p>
      </section>
    </main>
  );
}
