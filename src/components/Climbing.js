import React from 'react';

const stats = [
  { value: '50+', label: 'Summits Worldwide' },
  { value: '10', label: 'Years Guiding at Altitude' },
  { value: '2–10', label: 'Guides & Staff Led per Expedition' },
];

const expeditions = [
  {
    name: 'Mount Everest',
    location: 'Nepal / Tibet · 8,849m',
    role: 'Senior Supervising Guide · Expedition Team Leader',
    years: '2016 – 2021',
    detail: "Led expedition teams on the world's highest peak, managing risk, logistics, and client and staff wellbeing in a hyper objective-based guiding environment. Directed high-hazard rescues when required.",
  },
  {
    name: 'Mount Rainier',
    location: 'Washington, USA · 4,392m',
    role: 'Guide · Shift Supervisor, Crystal Mountain Ski Patrol',
    years: '2014 – 2019',
    detail: "Years of seasonal guiding and ski patrol work on Rainier's glaciated terrain built the technical foundation — crevasse rescue, avalanche assessment, cold-weather operations — for leading teams at altitude worldwide.",
  },
  {
    name: 'Ama Dablam',
    location: 'Nepal · 6,812m',
    role: 'Guide',
    detail: 'One of the most technical peaks on the standard Himalayan guiding circuit, requiring sustained rock and ice climbing above 6,000m.',
  },
  {
    name: 'Kilimanjaro',
    location: 'Tanzania · 5,895m',
    role: 'Guide',
    detail: "Africa's highest summit — a high-altitude, non-technical ascent testing client pacing, acclimatization protocol, and team management over multi-day routes.",
  },
];

export default function Climbing() {
  return (
    <main className="page-main" id="climbing">
      <section className="page-section reveal">
        <p className="section-label">Expedition Experience</p>
        <p>
          I spent a decade leading climbers on the world's highest peaks, closing my guiding
          career as Senior Supervising Guide and Everest Expedition Team Leader. That work meant
          managing risk, logistics, and the wellbeing of staff and clients in genuinely
          high-consequence environments: sustained decision-making with no do-overs, at altitude,
          in weather, under time pressure.
        </p>

        <div className="stat-row">
          {stats.map(({ value, label }) => (
            <div className="stat-item" key={label}>
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section reveal">
        <p className="section-label">Notable Expeditions</p>
        {expeditions.map(({ name, location, role, years, detail }) => (
          <div className="role" key={name}>
            <div className="role-head">
              <h3>{name}</h3>
              {years && <span className="dates">{years}</span>}
            </div>
            <p className="org">{location} · {role}</p>
            <p>{detail}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
