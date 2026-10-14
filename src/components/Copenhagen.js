import React, { useEffect, useRef, useState } from 'react';
import loadLeaflet from '../utils/loadLeaflet';
import { roasters } from '../data/coffee';
import { food, foodListUrl } from '../data/food';
import { eater, eaterListUrl } from '../data/eater';
import { museums, museumsListUrl } from '../data/museums';
import { pastries, pastriesListUrl } from '../data/pastries';
import { party, partyListUrl } from '../data/party';
import { sauna, saunaListUrl } from '../data/sauna';
import { useSearchParams } from 'react-router-dom';

const lists = {
  food: { label: 'Food', sectionTitle: 'Food & Drink', sourceUrl: foodListUrl, places: food, description: 'Restaurants, bars, and other food stops from the shared Copenhagen food list.' },
  eater: { label: 'Eater', sourceUrl: eaterListUrl, sourceLabel: 'Original Eater guide', places: eater, description: '38 places from Eater’s Copenhagen guide, July 2024 edition.' },
  museums: { label: 'Museums', sourceUrl: museumsListUrl, places: museums, description: 'Museums, art, gardens, and cultural stops in Copenhagen and nearby, from the shared museum list.' },
  pastries: { label: 'Pastries', sourceUrl: pastriesListUrl, places: pastries, description: 'Saved pastry stops, bakeries, and more from the shared pastry list.' },
  party: { label: 'Party', sourceUrl: partyListUrl, places: party, description: 'Bars and music venues from the shared party list.' },
  sauna: { label: 'Sauna', sourceUrl: saunaListUrl, places: sauna, description: 'Saunas and bathing spots from the shared sauna list.' },
  coffee: { label: 'Coffee', places: roasters, description: 'Single-origin, light roasts, pour-over, and experimental processing. One representative location per roaster.' },
};

// Include the northern museum trips and every saved branch in the map area.
const allPlaces = Object.values(lists).flatMap((list) => list.places);
const guideBounds = [
  [Math.min(...allPlaces.map((place) => place.lat)) - 0.05, Math.min(...allPlaces.map((place) => place.lon)) - 0.05],
  [Math.max(...allPlaces.map((place) => place.lat)) + 0.05, Math.max(...allPlaces.map((place) => place.lon)) + 0.05],
];

export default function Copenhagen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedList = searchParams.get('list');
  const listKey = Object.prototype.hasOwnProperty.call(lists, requestedList) ? requestedList : 'food';
  const currentList = lists[listKey];
  const places = currentList.places;
  const coffeeSelected = listKey === 'coffee';
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const placeLayersRef = useRef(null);
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    let map;
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !mapEl.current) return;
      map = L.map(mapEl.current, {
        maxBounds: guideBounds,
        maxBoundsViscosity: 1,
        scrollWheelZoom: true,
      });
      mapRef.current = map;
      placeLayersRef.current = L.layerGroup().addTo(map);
      const locationLayers = L.layerGroup().addTo(map);
      map.on('locationfound', (event) => {
        if (cancelled) return;
        setLocating(false);
        locationLayers.clearLayers();
        if (!L.latLngBounds(map.options.maxBounds).contains(event.latlng)) {
          setLocationStatus('You’re outside this Copenhagen map area. The saved places are still available below.');
          return;
        }
        L.circle(event.latlng, {
          radius: event.accuracy,
          color: '#3498db', weight: 1, fillOpacity: 0.12,
          interactive: false,
        }).addTo(locationLayers);
        L.circleMarker(event.latlng, {
          radius: 8, color: '#fff', weight: 3,
          fillColor: '#1685d1', fillOpacity: 1,
        }).addTo(locationLayers).bindTooltip('You are here');
        map.flyTo(event.latlng, 15);
        setLocationStatus(`Location found · accuracy approximately ${Math.round(event.accuracy)} m. The blue dot marks your location.`);
      });
      map.on('locationerror', (event) => {
        if (cancelled) return;
        setLocating(false);
        const messages = {
          1: 'Location access was denied. Allow location access in your browser settings, then try again.',
          2: 'Your location is unavailable. Check your device’s location services and try again.',
          3: 'Finding your location timed out. Please try again.',
        };
        setLocationStatus(messages[event.code] || 'Your location could not be found. Please try again.');
      });
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      }).addTo(map);
      setMapReady(true);
    }).catch(() => { if (!cancelled) setMapError(true); });
    return () => {
      cancelled = true;
      mapRef.current = null;
      placeLayersRef.current = null;
      if (map) {
        map.stopLocate();
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !placeLayersRef.current) return;
    const L = window.L;
    const map = mapRef.current;
    const layers = placeLayersRef.current;
    layers.clearLayers();
    places.forEach((place) => {
      const label = document.createElement('span');
      label.className = 'copenhagen-pin-label';
      label.textContent = place.shortName || place.name;
      // Separate labels when the source puts multiple venues at the same address.
      const colocated = places.filter((other) => other.lat === place.lat && other.lon === place.lon);
      if (colocated.length > 1) {
        const index = colocated.indexOf(place);
        label.style.left = index % 2 ? '18px' : '-6px';
        label.style.transform = index % 2 ? 'none' : 'translateX(-100%)';
        label.style.bottom = `${16 + Math.floor(index / 2) * 32}px`;
      }
      const icon = L.divIcon({
        className: `copenhagen-pin${place.priority ? ' priority' : ''}`,
        html: label,
        iconSize: [12, 12], iconAnchor: [6, 6], tooltipAnchor: [0, 8],
      });
      const tooltip = document.createElement('span');
      tooltip.textContent = place.name;
      if (place.area) {
        const area = document.createElement('small');
        area.textContent = place.area;
        tooltip.appendChild(area);
      }
      L.marker([place.lat, place.lon], { icon, title: place.name, alt: place.name })
        .addTo(layers)
        .bindTooltip(tooltip, { className: 'peak-tip', direction: 'top' })
        .on('click', () => setSelected(place));
    });
    map.setMinZoom(0);
    map.fitBounds(places.map((place) => [place.lat, place.lon]), { padding: [80, 60] });
    map.setMinZoom(map.getZoom());
  }, [places, mapReady]);

  useEffect(() => {
    if (selected && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const close = () => {
    dialogRef.current.close();
    setSelected(null);
  };

  const select = (place) => {
    if (mapRef.current) mapRef.current.flyTo([place.lat, place.lon], 15);
    setSelected(place);
  };

  const findMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Your browser does not support location access.');
      return;
    }
    if (!window.isSecureContext) {
      setLocationStatus('Location access requires HTTPS or localhost.');
      return;
    }
    if (!mapRef.current || locating) return;
    setLocating(true);
    setLocationStatus('Finding your location…');
    mapRef.current.locate({
      setView: false, watch: false, enableHighAccuracy: true,
      timeout: 15000, maximumAge: 0,
    });
  };

  return (
    <main className="page-main coffee-page" id="copenhagen">
      <nav className="site-nav copenhagen-nav" aria-label="Copenhagen lists">
        <span className="brand">Copenhagen</span>
        <div className="copenhagen-nav-lists">
          {Object.entries(lists).map(([key, list]) => (
            <button
              key={key}
              className={`nav-link${key === listKey ? ' active' : ''}`}
              aria-pressed={key === listKey}
              onClick={() => {
                close();
                setSearchParams({ list: key }, { replace: true });
              }}
            >{list.label}</button>
          ))}
        </div>
      </nav>
      <section className="page-section reveal">
        <h2 className="section-label">Copenhagen {currentList.label} Map</h2>
        <p>{currentList.description}</p>
        {currentList.sourceUrl && <p><a href={currentList.sourceUrl} target="_blank" rel="noopener noreferrer">{currentList.sourceLabel || 'Original Google Maps list'} ↗</a></p>}
        <p className="exmap-hint">Click a named pin for details · scroll or drag to explore</p>
        {coffeeSelected && <div className="coffee-legend">
          <span><i className="priority" />High priority</span>
          <span><i />Other worthwhile roasters</span>
        </div>}
        <div className="coffee-location-controls">
          <button className="coffee-find-me" onClick={findMe} disabled={!mapReady || locating}>
            {locating ? 'Finding you…' : 'Find me'}
          </button>
          <p role="status" aria-live="polite">{locationStatus}</p>
        </div>
        {mapError && <p role="status">The map could not load. All locations and directions are available below.</p>}
        <div className="exmap-leaflet coffee-map" ref={mapEl} aria-label={`Map of Copenhagen ${currentList.label.toLowerCase()} places`} />
      </section>
      {(coffeeSelected ? [true, false] : [false]).map((priority) => (
        <section className="page-section" key={String(priority)}>
          <h2 className="section-label">{coffeeSelected ? (priority ? 'High Priority' : 'Other Worthwhile Roasters') : (currentList.sectionTitle || currentList.label)}</h2>
          <div className="coffee-list">
            {places.filter((place) => place.priority === priority).map((place) => (
              <button className="coffee-row" key={place.id} onClick={() => select(place)}>
                <span className={`coffee-number${priority ? ' priority' : ''}`}>{place.id}</span>
                <span>
                  <span className="coffee-name">{place.name}</span>
                  <span className="coffee-address">{place.address || 'Address on Google Maps'}{place.area && ` · ${place.area}`}</span>
                  {place.detail && <span className="coffee-detail">{place.detail}</span>}
                  {place.note && <span className="coffee-note">{place.note}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
      <dialog className="coffee-dialog" ref={dialogRef} onCancel={close} onClose={() => setSelected(null)} onClick={(event) => {
        if (event.target === dialogRef.current) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }
      }} aria-labelledby="coffee-detail-title">
        {selected && <>
          <button className="coffee-close" onClick={close} aria-label="Close details" autoFocus>×</button>
          <p className="section-label">{coffeeSelected ? (selected.priority ? 'High Priority' : 'Other Worthwhile Roaster') : (currentList.sectionTitle || currentList.label)} · {selected.id}</p>
          <h2 id="coffee-detail-title">{selected.name}</h2>
          {(selected.address || selected.area) && <p>{selected.address}{selected.area && <><br />{selected.area}</>}</p>}
          {selected.detail && <p className="coffee-detail">{selected.detail}</p>}
          {selected.descriptionUrl && <p><a href={selected.descriptionUrl} target="_blank" rel="noopener noreferrer">About this place ↗</a></p>}
          {selected.mapsUrl && <p><a href={selected.mapsUrl} target="_blank" rel="noopener noreferrer">View place on Google Maps ↗</a></p>}
          {selected.note && <p className="coffee-note">{selected.note}</p>}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selected.lat},${selected.lon}`)}`} target="_blank" rel="noopener noreferrer">Get directions ↗</a>
        </>}
      </dialog>
    </main>
  );
}
