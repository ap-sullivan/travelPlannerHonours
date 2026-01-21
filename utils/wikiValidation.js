
// exclude categories that are irrelevant

export function isRejectedCategory(categories = []) {
  const rejectKeywords = [
    "living people",
    "births",
    "deaths",
    "singers",
    "musicians",
    "politicians",
    "writers",
    "actors",
    "albums",
    "songs",
    "books",
  ];

  return categories.some(cat =>
    rejectKeywords.some(word =>
      cat.toLowerCase().includes(word)
    )
  );
}

// makes ure the coordinates from wiki are within a certain distance of the geoapify place

const MAX_DISTANCE_METERS = 500;

// Haversine formula
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (v) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isCoordMismatch(pageCoords, attractionCoords) {
  if (!pageCoords || !attractionCoords) return true;

  const { lat: aLat, lon: aLon } = attractionCoords;
  const { lat: pLat, lon: pLon } = pageCoords;

  const distance = getDistanceMeters(aLat, aLon, pLat, pLon);

  return distance > MAX_DISTANCE_METERS;
}