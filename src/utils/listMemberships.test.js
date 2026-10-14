import addListMemberships from './listMemberships';

test('matches alternate names for the same nearby location and counts each list once', () => {
  const lists = addListMemberships({
    food: { label: 'Food', places: [{ name: 'Slurp Ramen', shortName: 'Slurp', lat: 55.685126, lon: 12.567208 }] },
    eater: { label: 'Eater', places: [
      { name: 'Slurp Ramen Joint', shortName: 'Slurp', lat: 55.685127, lon: 12.567208 },
      { name: 'Slurp Ramen Joint', shortName: 'Slurp', lat: 55.685127, lon: 12.567208 },
    ] },
  });
  expect(lists.food.places[0].memberships.map((list) => list.label)).toEqual(['Food', 'Eater']);
  expect(lists.food.places[0].shared).toBe(true);
});

test('keeps separate branches and neighbouring businesses distinct', () => {
  const lists = addListMemberships({
    pastries: { label: 'Pastries', places: [
      { name: 'Hart', lat: 55.679554, lon: 12.601116 },
      { name: 'Hart', lat: 55.685187, lon: 12.588321 },
      { name: 'Esmée', lat: 55.681362, lon: 12.586435 },
    ] },
    eater: { label: 'Eater', places: [
      { name: 'Hart Bageri Holmen', shortName: 'Hart', lat: 55.679554, lon: 12.601116 },
      { name: 'Goldfinch', lat: 55.681362, lon: 12.586435 },
    ] },
  });
  expect(lists.pastries.places.map((place) => place.shared)).toEqual([true, false, false]);
});

test('recognises the same Google Maps place despite different titles', () => {
  const mapsUrl = 'https://www.google.com/maps?cid=18187285694279388086';
  const lists = addListMemberships({
    food: { label: 'Food', places: [{ name: 'Melee', mapsUrl, lat: 55.6757724, lon: 12.5426171 }] },
    keld: { label: 'Keld’s recommendations', places: [{ name: 'Mêlée', mapsUrl, lat: 55.6757724, lon: 12.5426171 }] },
  });
  expect(lists.food.places[0].shared).toBe(true);
});
