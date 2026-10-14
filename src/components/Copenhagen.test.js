import React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Copenhagen from './Copenhagen';
import loadLeaflet from '../utils/loadLeaflet';
import { roasters } from '../data/coffee';

jest.mock('../utils/loadLeaflet', () => jest.fn());

let map;
let events;
let layers;
let observers;
let frames;
const layer = () => {
  const result = { addTo: jest.fn(), bindTooltip: jest.fn(), on: jest.fn(), clearLayers: jest.fn(), redraw: jest.fn() };
  result.addTo.mockReturnValue(result);
  result.bindTooltip.mockReturnValue(result);
  result.on.mockReturnValue(result);
  return result;
};

beforeEach(() => {
  events = {};
  layers = [];
  observers = [];
  frames = [];
  window.ResizeObserver = jest.fn(function (callback) {
    this.notify = callback;
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    observers.push(this);
  });
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  map = {
    options: { maxBounds: [[55.61, 12.45], [55.75, 12.69]] },
    on: jest.fn((name, callback) => { events[name] = callback; }),
    fitBounds: jest.fn(), setMinZoom: jest.fn(), getZoom: () => 12,
    flyTo: jest.fn(), setView: jest.fn(), stop: jest.fn(), invalidateSize: jest.fn(), locate: jest.fn(), stopLocate: jest.fn(), remove: jest.fn(),
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

test.each(['food', 'coffee', 'museums', 'pastries', 'party', 'sauna', 'eater', 'keld'])(
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
    expect(marker.bindTooltip).not.toHaveBeenCalled();
    expect(window.L.marker.mock.calls[0][1]).not.toHaveProperty('title');
    const clickPin = marker.on.mock.calls.find(([name]) => name === 'click')[1];
    act(() => clickPin());
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: firstName })).toBeInTheDocument();
    expect(within(dialog).getByText(firstDescription)).toBeInTheDocument();
    expect(within(dialog).queryByRole('link', { name: /get directions/i })).not.toBeInTheDocument();
  }
);

afterEach(() => { jest.restoreAllMocks(); });

test.each(roasters)('$name exposes its website and saved location in the detail card', async (place) => {
  const { container } = openPage('/copenhagen?list=coffee');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const row = Array.from(container.querySelectorAll('.coffee-row')).find((row) => row.querySelector('.coffee-name').textContent === place.name);
  fireEvent.click(row);
  const dialog = within(screen.getByRole('dialog'));
  expect(dialog.getByRole('link', { name: 'Visit website ↗' })).toHaveAttribute('href', place.websiteUrl);
  expect(dialog.getByRole('link', { name: 'View place on Google Maps ↗' })).toHaveAttribute('href', place.mapsUrl);
  expect(new URL(place.mapsUrl).searchParams.get('query')).toContain(place.address);
});

test.each([
  ['food', 'Pompette', ['Food', 'Eater']],
  ['food', 'Primero Cocktail-Bar & Restaurant', ['Food', 'Keld’s recommendations']],
  ['coffee', 'Prolog Coffee Bar', ['Eater', 'Coffee']],
  ['museums', 'ARKEN Museum of Contemporary Art', ['Museums', 'Pastries']],
  ['sauna', 'La Banchina', ['Eater', 'Sauna']],
])('%s shared place %s is green and names all its lists in the detail card', async (key, name, labels) => {
  const { container } = openPage(`/copenhagen?list=${key}`);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const row = Array.from(container.querySelectorAll('.coffee-row')).find((row) => row.querySelector('.coffee-name').textContent === name);
  expect(row).toHaveClass('shared');
  const index = window.L.marker.mock.calls.findIndex(([, options]) => options.alt === name);
  expect(window.L.divIcon.mock.calls[index][0].className).toContain('shared');
  fireEvent.click(row);
  const membership = screen.getByRole('dialog').querySelector('.coffee-memberships');
  expect(membership).toHaveTextContent(`Appears in: ${labels.join(' · ')}`);
});

test('a second bakery branch does not inherit another branch’s list memberships', async () => {
  const { container } = openPage('/copenhagen?list=pastries');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const branches = Array.from(container.querySelectorAll('.coffee-row')).filter((row) => row.querySelector('.coffee-name').textContent === 'Hart');
  expect(branches[0]).toHaveClass('shared');
  expect(branches[1]).not.toHaveClass('shared');
  fireEvent.click(branches[1]);
  expect(screen.getByRole('dialog').querySelector('.coffee-memberships')).toHaveTextContent('Appears in: Pastries');
});

const categoryButton = (key) => within(screen.getByRole('navigation', { name: 'Copenhagen lists' })).getByRole('button', { name: new RegExp(`^${key === 'keld' ? 'Keld’s recommendations' : key}$`, 'i') });

const openPage = (url = '/copenhagen') => render(
  <MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Copenhagen />
  </MemoryRouter>
);

test('switching lists replaces places and markers while preserving the location layer', async () => {
  openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  expect(categoryButton('Food')).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getAllByRole('button').filter((button) => button.classList.contains('coffee-row'))).toHaveLength(30);
  expect(screen.getByText('Recommended by Keld - good for lunch')).toBeInTheDocument();
  expect(window.L.marker).toHaveBeenCalledTimes(30);
  expect(window.L.divIcon.mock.calls[0][0].html.textContent).toBe('Pompette');
  expect(screen.getByRole('navigation', { name: 'Copenhagen lists' }).querySelectorAll('.copenhagen-nav-lists button')).toHaveLength(8);
  const locationClearCount = layers[1].clearLayers.mock.calls.length;
  fireEvent.click(categoryButton('Coffee'));
  expect(screen.queryByText('Pompette')).not.toBeInTheDocument();
  expect(screen.getByText('April Coffee Store & Showroom')).toBeInTheDocument();
  expect(screen.getAllByRole('button').filter((button) => button.classList.contains('coffee-row'))).toHaveLength(14);
  expect(window.L.marker).toHaveBeenCalledTimes(44);
  expect(layers[1].clearLayers).toHaveBeenCalledTimes(locationClearCount);
  expect(window.L.map).toHaveBeenCalledTimes(1);
  for (const [key, count, firstPlace] of [
    ['museums', 16, 'ARKEN Museum of Contemporary Art'],
    ['pastries', 13, 'ARKEN Museum of Contemporary Art'],
    ['party', 2, 'Pumpehuset'],
    ['sauna', 4, 'SaunaNor'],
    ['eater', 38, 'Jordnær'],
    ['keld', 5, 'Primero Cocktail-Bar & Restaurant'],
  ]) {
    fireEvent.click(categoryButton(key));
    expect(categoryButton(key)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(firstPlace)).toBeInTheDocument();
    expect(screen.getAllByRole('button').filter((button) => button.classList.contains('coffee-row'))).toHaveLength(count);
    expect(layers[1].clearLayers).toHaveBeenCalledTimes(locationClearCount);
    expect(window.L.map).toHaveBeenCalledTimes(1);
  }
});

test('the list menu closes after selection, Escape, or tapping outside', async () => {
  openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const toggle = screen.getByRole('button', { name: 'Choose a list' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(categoryButton('Museums'));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(categoryButton('Museums')).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(toggle);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
  fireEvent.click(toggle);
  fireEvent.pointerDown(document.body);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test.each([
  ['museums', 'Kronborg Castle'],
  ['pastries', 'Sommer Canteen'],
  ['party', 'Jolene Bar'],
  ['sauna', 'La Banchina'],
  ['eater', 'Jordnær'],
  ['keld', 'Primero Cocktail-Bar & Restaurant'],
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
  expect(map.setView).toHaveBeenCalledWith({ lat: 55.68, lng: 12.57 }, 15, { animate: false });
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
  expect(map.setView).not.toHaveBeenCalled();
  fireEvent.click(button);
  act(() => events.locationerror({ code: 1 }));
  expect(screen.getByRole('status')).toHaveTextContent('Allow location access in your browser settings');
  expect(button).toBeEnabled();
});


test('switching lists and showing all keep a usable fixed zoom range', async () => {
  openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const options = window.L.map.mock.calls[0][1];
  expect(options.minZoom).toBe(8);
  expect(options.maxZoom).toBe(20);
  const tileOptions = window.L.tileLayer.mock.calls[0][1];
  expect(tileOptions.maxNativeZoom).toBe(19);
  expect(tileOptions.maxZoom).toBe(20);
  fireEvent.click(categoryButton('Party'));
  fireEvent.click(screen.getByRole('button', { name: 'Show all' }));
  expect(map.setMinZoom).not.toHaveBeenCalled();
  expect(map.fitBounds).toHaveBeenLastCalledWith(expect.any(Array), expect.objectContaining({ animate: false, maxZoom: 15 }));
  expect(map.stop).toHaveBeenCalled();
});

test('the map refreshes its dimensions after resizing and disconnects on unmount', async () => {
  const { unmount } = openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const initialCalls = map.invalidateSize.mock.calls.length;
  act(() => {
    observers[0].notify();
    frames[frames.length - 1]();
  });
  expect(map.invalidateSize.mock.calls.length).toBeGreaterThan(initialCalls);
  expect(map.invalidateSize).toHaveBeenLastCalledWith({ pan: false, debounceMoveend: true });
  unmount();
  expect(observers[0].disconnect).toHaveBeenCalled();
  expect(map.remove).toHaveBeenCalled();
});

test('failed tiles offer a reload without resetting the location or rebuilding the map', async () => {
  openPage();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  const tiles = window.L.tileLayer.mock.results[0].value;
  const tileEvent = (name) => tiles.on.mock.calls.find(([event]) => event === name)[1];
  act(() => tileEvent('tileerror')());
  expect(screen.getByText(/Some map tiles could not load/)).toBeInTheDocument();
  const locationClears = layers[1].clearLayers.mock.calls.length;
  fireEvent.click(screen.getByRole('button', { name: 'Reload map' }));
  expect(tiles.redraw).toHaveBeenCalled();
  expect(window.L.map).toHaveBeenCalledTimes(1);
  expect(layers[1].clearLayers).toHaveBeenCalledTimes(locationClears);
  act(() => {
    tileEvent('loading')();
    tileEvent('load')();
  });
  expect(screen.queryByRole('button', { name: 'Reload map' })).not.toBeInTheDocument();
});

test('an initialization failure can be retried', async () => {
  loadLeaflet.mockRejectedValueOnce(new Error('load failed'));
  openPage();
  const retry = await screen.findByRole('button', { name: 'Reload map' });
  fireEvent.click(retry);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Find me' })).toBeEnabled());
  expect(screen.queryByRole('button', { name: 'Reload map' })).not.toBeInTheDocument();
});
