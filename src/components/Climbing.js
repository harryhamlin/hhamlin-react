import React, { useEffect, useRef, useState } from 'react';
import everestPhoto from '../images/everest.jpg';
import lhotsePhoto from '../images/lhotse.jpg';
import amaDablamPhoto from '../images/ama-dablam.jpg';
import rainierPhoto from '../images/rainier.jpg';
import aconcaguaPhoto from '../images/aconcagua.jpg';
import kilimanjaroPhoto from '../images/kilimanjaro.jpg';
import illimaniPhoto from '../images/illimani.jpg';

// Climbing page: the expedition record plus an interactive map (Leaflet,
// loaded from CDN). Each peak places a marker — hover for the summit, click
// for the full record.
const expeditions = [
  {
    name: 'Mount Everest',
    location: 'Nepal / Tibet · 8,849m',
    role: 'Senior Supervising Guide · Expedition Team Leader',
    years: '2016 – 2021',
    detail:
      "Led expedition teams on the world's highest peak, managing risk, logistics, and client and staff wellbeing in a hyper objective-based guiding environment. Directed high-hazard rescues when required.",
    image: everestPhoto,
    lat: 27.9881,
    lon: 86.925,
  },
  {
    name: 'Lhotse',
    location: 'Nepal / Tibet · 8,516m',
    role: 'Guide',
    detail:
      "The world's fourth-highest peak, sharing its lower route with Everest before splitting off through the Lhotse Face and Couloir for steep, sustained ice climbing above 8,000m.",
    image: lhotsePhoto,
    lat: 27.9617,
    lon: 86.933,
  },
  {
    name: 'Ama Dablam',
    location: 'Nepal · 6,812m',
    role: 'Guide',
    detail:
      'One of the most technical peaks on the standard Himalayan guiding circuit, requiring sustained rock and ice climbing above 6,000m.',
    image: amaDablamPhoto,
    lat: 27.8617,
    lon: 86.8611,
  },
  {
    name: 'Mount Rainier',
    location: 'Washington, USA · 4,392m',
    role: 'Guide · Shift Supervisor, Crystal Mountain Ski Patrol',
    years: '2014 – 2019',
    detail:
      "40+ summits. Years of seasonal guiding and ski patrol work on Rainier's glaciated terrain built the technical foundation (crevasse rescue, avalanche assessment, cold-weather operations) for leading teams at altitude worldwide.",
    image: rainierPhoto,
    lat: 46.8523,
    lon: -121.7603,
  },
  {
    name: 'Aconcagua',
    location: 'Argentina · 6,961m',
    role: 'Guide',
    detail:
      'The highest peak in the Americas and the Southern and Western Hemispheres, a high-altitude expedition demanding careful acclimatization and endurance through extreme wind exposure.',
    image: aconcaguaPhoto,
    lat: -32.6533,
    lon: -70.0109,
  },
  {
    name: 'Kilimanjaro',
    location: 'Tanzania · 5,895m',
    role: 'Guide',
    detail:
      "Africa's highest summit, a high-altitude, non-technical ascent testing client pacing, acclimatization protocol, and team management over multi-day routes.",
    image: kilimanjaroPhoto,
    lat: -3.0674,
    lon: 37.3556,
  },
  {
    name: 'Illimani',
    location: 'Bolivia · 6,438m',
    role: 'Guide',
    detail:
      "The highest peak in Bolivia's Cordillera Real, requiring glacier travel and crevasse navigation on approach to a summit overlooking La Paz.",
    image: illimaniPhoto,
    lat: -16.6392,
    lon: -67.7775,
  },
];

const PIN_SVG =
  '<svg viewBox="0 0 30 38" aria-hidden="true">' +
  '<path d="M15 0C7 0 1 6 1 14c0 9.5 14 24 14 24s14-14.5 14-24C29 6 23 0 15 0z" fill="#c62d2d" stroke="#8f1d1d" stroke-width="1"/>' +
  '<circle cx="15" cy="14" r="5" fill="#fff"/></svg>';

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const existing = document.getElementById('leaflet-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L));
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function Climbing() {
  const mapEl = useRef(null);
  const [selected, setSelected] = useState(null);

  // Build the Leaflet map once, on mount.
  useEffect(() => {
    let map;
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || mapEl.current._leaflet_id) return;

        map = L.map(mapEl.current, {
          scrollWheelZoom: true,
          worldCopyJump: false,
          maxBounds: [[-85, -180], [85, 180]],
          maxBoundsViscosity: 1,
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19,
          noWrap: true,
          bounds: [[-85, -180], [85, 180]],
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        }).addTo(map);

        const icon = L.divIcon({
          className: 'peak-pin',
          html: PIN_SVG,
          iconSize: [30, 38],
          iconAnchor: [15, 38],
          tooltipAnchor: [0, -34],
        });

        expeditions.forEach((peak) => {
          const marker = L.marker([peak.lat, peak.lon], { icon }).addTo(map);
          marker.bindTooltip(`${peak.name}<small>${peak.location}</small>`, {
            className: 'peak-tip',
            direction: 'top',
            opacity: 1,
          });
          marker.on('click', () => setSelected(peak));
        });

        // Default view: exactly one copy of the world, filling the map (poles
        // cropped rather than repeating Earth horizontally). Lock zoom-out here
        // so the single world can't be shrunk into grey.
        const worldBounds = L.latLngBounds([-85, -180], [85, 180]);
        const worldZoom = map.getBoundsZoom(worldBounds, true);
        map.setView([20, 0], worldZoom);
        map.setMinZoom(worldZoom);
      })
      .catch(() => {
        /* Leaflet failed to load (offline / CDN blocked); map stays empty. */
      });

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  // Close the detail card with Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <main className="page-main" id="climbing">
      <section className="page-section reveal">
        <p className="section-label">Expedition Experience</p>
        <p>
          I spent a decade leading climbers on the world's highest peaks, closing my guiding
          career as Senior Supervising Guide and Everest Expedition Team Leader. That work meant
          managing risk, logistics, and the wellbeing of staff and clients in genuinely
          high-consequence environments.
        </p>
      </section>

      <section className="page-section reveal" id="expedition-map">
        <p className="section-label">Expedition Map</p>
        <p className="exmap-hint">
          Hover a marker for the peak · click a marker for the full record · scroll or drag to
          explore
        </p>
        <div className="exmap-leaflet" ref={mapEl} />
      </section>

      <section className="page-section reveal">
        <p className="section-label">Notable Expeditions</p>
        {expeditions.map((peak) => (
          <div
            className="expedition clickable"
            key={peak.name}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(peak)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelected(peak);
              }
            }}
          >
            <div className="expedition-media">
              {peak.image ? (
                <img src={peak.image} alt={peak.name} />
              ) : (
                <div className="expedition-media-placeholder" aria-hidden="true">
                  <span>Photo</span>
                </div>
              )}
            </div>
            <div className="expedition-body">
              <div className="role-head">
                <h3>{peak.name}</h3>
                {peak.years && <span className="dates">{peak.years}</span>}
              </div>
              <p className="org">
                {peak.location} · {peak.role}
              </p>
              <p>{peak.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <div
        className={`exmap-overlay${selected ? ' open' : ''}`}
        onClick={() => setSelected(null)}
        aria-hidden={!selected}
      >
        {selected && (
          <div className="exmap-card" onClick={(e) => e.stopPropagation()}>
            <button className="close" aria-label="Close" onClick={() => setSelected(null)}>
              ×
            </button>
            {selected.image && <img className="photo" src={selected.image} alt={selected.name} />}
            <div className="cbody">
              <div className="role-head">
                <h3>{selected.name}</h3>
                {selected.years && <span className="dates">{selected.years}</span>}
              </div>
              <p className="org">
                {selected.location} · {selected.role}
              </p>
              <p className="detail">{selected.detail}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
