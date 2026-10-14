import React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Copenhagen from './Copenhagen';
import loadLeaflet from '../utils/loadLeaflet';

jest.mock('../utils/loadLeaflet', () => jest.fn());

let map;
let events;
let layers;
const layer = () => {
  const result = { addTo: jest.fn(), bindTooltip: jest.fn(), on: jest.fn(), clearLayers: jest.fn() };
  result.addTo.mockReturnValue(result);
  result.bindTooltip.mockReturnValue(result);
  result.on.mockReturnValue(result);
  return result;
};

beforeEach(() => {
  events = {};
  layers = [];
  map = {
    options: { maxBounds: [[55.61, 12.45], [55.75, 12.69]] },
    on: jest.fn((name, callback) => { events[name] = callback; }),
    fitBounds: jest.fn(), setMinZoom: jest.fn(), getZoom: () => 12,
    flyTo: jest.fn(), locate: jest.fn(), stopLocate: jest.fn(), remove: jest.fn(),
  };
  window.L = {
    map: jest.fn(() => map),
    layerGroup: jest.fn(() => { const group = layer(); layers.push(group); return group; }),
    tileLayer: jest.fn(layer), marker: jest.fn(layer), divIcon: jest.fn(),
    circle: jest.fn(layer), circleMarker: jest.fn(layer),
    latLngBounds: () => ({ contains: ({ lat, lng }) => lat >= 55.61 && lat <= 55.75 && lng >= 12.45 && lng <= 12.69 }),
  };
  loadLeaflet.mockResolvedValue(window.L);
  HTMLDialogElement.prototype.close = jest.fn();
  HTMLDialogElement.prototype.showModal = jest.fn(function () { this.setAttribute('open', ''); });
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {} });
  Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
});

test.each(['food', 'coffee', 'museums', 'pastries', 'party', 'sauna', 'eater'])(
  '%s descriptions appear in every list row and in the clicked pin details', async (key) => {
    const { container } = openPage(`/copenhagen?list=${key}`);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
    const rows = Array.from(container.querySelectorAll('.coffee-row'));
    rows.forEach((row) => {
      expect(row.querySelector('.coffee-detail')).not.toBeNull();
      expect(row.querySelector('.coffee-detail').textContent.length).toBeGreaterThan(30);
    });
    const firstDescription = rows[0].querySelector('.coffee-detail').textContent;
    const firstName = rows[0].querySelector('.coffee-name').textContent;
    const marker = window.L.marker.mock.results[0].value;
    const clickPin = marker.on.mock.calls.find(([name]) => name === 'click')[1];
    act(() => clickPin());
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: firstName })).toBeInTheDocument();
    expect(within(dialog).getByText(firstDescription)).toBeInTheDocument();
  }
);

const categoryButton = (key) => within(screen.getByRole('navigation', { name: 'Copenhagen lists' })).getByRole('button', { name: new RegExp(`^${key}$`, 'i') });

const openPage = (url = '/copenhagen') => render(
  <MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Copenhagen />
  </MemoryRouter>
);

test('switching lists replaces places and markers while preserving the location layer', async () => {
  openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  expect(categoryButton('Food')).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('button').filter((button) => button.className === 'coffee-row')).toHaveLength(30);
  expect(screen.getByText('Recommended by Keld - good for lunch')).toBeInTheDocument();
  expect(window.L.marker).toHaveBeenCalledTimes(30);
  expect(window.L.divIcon.mock.calls[0][0].html.textContent).toBe('Pompette');
  expect(screen.getByRole('navigation', { name: 'Copenhagen lists' }).querySelectorAll('button')).toHaveLength(7);
  const locationClearCount = layers[1].clearLayers.mock.calls.length;
  fireEvent.click(categoryButton('Coffee'));
  expect(screen.queryByText('Pompette')).not.toBeInTheDocument();
  expect(screen.getByText('April Coffee Store & Showroom')).toBeInTheDocument();
  expect(screen.getAllByRole('button').filter((button) => button.className === 'coffee-row')).toHaveLength(14);
  expect(window.L.marker).toHaveBeenCalledTimes(44);
  expect(layers[1].clearLayers).toHaveBeenCalledTimes(locationClearCount);
  expect(window.L.map).toHaveBeenCalledTimes(1);
  for (const [key, count, firstPlace] of [
    ['museums', 16, 'ARKEN Museum of Contemporary Art'],
    ['pastries', 13, 'ARKEN Museum of Contemporary Art'],
    ['party', 2, 'Pumpehuset'],
    ['sauna', 4, 'SaunaNor'],
    ['eater', 38, 'Jordnær'],
  ]) {
    fireEvent.click(categoryButton(key));
    expect(categoryButton(key)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(firstPlace)).toBeInTheDocument();
    expect(screen.getAllByRole('button').filter((button) => button.className === 'coffee-row')).toHaveLength(count);
    expect(layers[1].clearLayers).toHaveBeenCalledTimes(locationClearCount);
    expect(window.L.map).toHaveBeenCalledTimes(1);
  }
});

test.each([
  ['museums', 'Kronborg Castle'],
  ['pastries', 'Sommer Canteen'],
  ['party', 'Jolene Bar'],
  ['sauna', 'La Banchina'],
  ['eater', 'Jordnær'],
])('%s can be opened directly and links to its original list', async (key, place) => {
  openPage(`/copenhagen?list=${key}`);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  expect(categoryButton(key)).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText(place)).toBeInTheDocument();
  const source = key === 'eater' ? ['Original Eater guide ↗', 'eater.com/maps/'] : ['Original Google Maps list ↗', 'maps.app.goo.gl/'];
  expect(screen.getByRole('link', { name: source[0] })).toHaveAttribute('href', expect.stringContaining(source[1]));
  if (key === 'museums') {
    const bounds = window.L.map.mock.calls[0][1].maxBounds;
    expect(bounds[0][0]).toBeLessThan(55.606182);
    expect(bounds[0][1]).toBeLessThan(12.3876347);
    expect(bounds[1][0]).toBeGreaterThan(56.039332);
  }
});

test('coffee deep link works and location access is requested only on click', async () => {
  openPage('/copenhagen?list=coffee');
  const button = screen.getByRole('button', { name: 'Find me' });
  await waitFor(() => expect(button).toBeEnabled());
  expect(categoryButton('Coffee')).toHaveAttribute('aria-pressed', 'true');
  expect(map.locate).not.toHaveBeenCalled();
  fireEvent.click(button);
  expect(map.locate).toHaveBeenCalledWith(expect.objectContaining({ watch: false, setView: false }));
  act(() => events.locationfound({ latlng: { lat: 55.68, lng: 12.57 }, accuracy: 18 }));
  expect(map.flyTo).toHaveBeenCalledWith({ lat: 55.68, lng: 12.57 }, 15);
  expect(screen.getByRole('status')).toHaveTextContent('accuracy approximately 18 m');
  expect(button).toBeEnabled();
});

test('outside-Copenhagen locations and denied permissions give actionable feedback', async () => {
  openPage();
  const button = screen.getByRole('button', { name: 'Find me' });
  await waitFor(() => expect(button).toBeEnabled());
  fireEvent.click(button);
  act(() => events.locationfound({ latlng: { lat: 47.6, lng: -122.3 }, accuracy: 20 }));
  expect(screen.getByRole('status')).toHaveTextContent('outside this Copenhagen map area');
  expect(map.flyTo).not.toHaveBeenCalled();
  fireEvent.click(button);
  act(() => events.locationerror({ code: 1 }));
  expect(screen.getByRole('status')).toHaveTextContent('Allow location access in your browser settings');
  expect(button).toBeEnabled();
});
