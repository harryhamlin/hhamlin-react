import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ship the library and stylesheet together; no separate CDN load or global race.
export default function loadLeaflet() {
  return Promise.resolve(L);
}
