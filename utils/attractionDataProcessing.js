// utility function to process and merge Geoapify attractions with must see list, remove dupes and convert to GeoJSON for map display

export function processAttractions({
 attractions = [],
  mustSeeForCity = [],
}) {
    // normalise must see list to same format as geoapify results and add a flag for UI
  const normalisedMustSee = mustSeeForCity.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: "Must see",
    lat: item.lat,
    lon: item.lon,
    categories: ["must_see"],
    wikidata: item.wikidata,
    isMustSee: true,
  }));

  // filter geapify to remove dupes
  const mustSeeNames = new Set(
    normalisedMustSee.map((a) => a.name.toLowerCase())
  );

  const filteredGeoapifyAttractions = attractions.filter(
    (a) => !mustSeeNames.has(a.name.toLowerCase())
  );

  // merge lists
  const mergedAttractions = [
    ...normalisedMustSee,
    ...filteredGeoapifyAttractions,
  ];

  // add display index
  const numberedAttractions = mergedAttractions.map((item, index) => ({
    ...item,
    displayIndex: index + 1,
  }));

  // convert to GeoJSON for map display
  const geojson = {
    type: "FeatureCollection",
    features: numberedAttractions.map((item) => ({
      type: "Feature",
      id: item.id,
      properties: {
        name: item.name,
        subtitle: item.subtitle,
        categories: item.categories,
        index: item.displayIndex,
      },
      geometry: {
        type: "Point",
        coordinates: [item.lon, item.lat],
      },
    })),
  };

  return {
    list: numberedAttractions,
    geojson,
  };
}