// utility function to process and merge Geoapify hotels with favourites list, remove dupes and convert to GeoJSON for map display

export function processHotels({
  hotels = [],
  favouriteHotels = [],
}) {
  // normalise favourites
  const normalisedFavouriteHotels = favouriteHotels.map((item) => ({
    id: item.id,
    name: item.name,
    subtitle: "App Favourite",
    lat: item.lat,
    lon: item.lon,
    categories: ["favourite"],
    isFavourite: true,
  }));

  // remove duplicates from API data
  const toLower = (str) => str?.toLowerCase?.() ?? "";

  const favouriteHotelNames = new Set(
    normalisedFavouriteHotels.map((a) => toLower(a.name))
  );

  const filteredGeoapifyHotels = hotels.filter(
    (a) => !favouriteHotelNames.has(toLower(a.name))
  );

  // merge lists
  const mergedHotels = [
    ...normalisedFavouriteHotels,
    ...filteredGeoapifyHotels,
  ];

  // add display index
  const numberedHotels = mergedHotels.map((item, index) => ({
    ...item,
    displayIndex: index + 1,
  }));

  // convert to GeoJSON
  const geojson = {
    type: "FeatureCollection",
    features: numberedHotels.map((item) => ({
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
    list: numberedHotels,
    geojson,
  };
}