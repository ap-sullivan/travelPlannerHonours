const BASE = "https://api.mapbox.com/search/searchbox/v1";

// Keep this list small and “touristy”
const DEFAULT_ATTRACTION_CATEGORIES = [
  "tourist_attraction",
  "museum",
  "landmark",
  "historic_site",
  "art_gallery",
  "castle",
];


function requireToken() {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    throw new Error("Missing EXPO_PUBLIC_MAPBOX_TOKEN");
  }
  return token;
}

/**
 * Suggest POIs for a city using Search Box.
 * Returns lightweight list items for your FlatList.
 */
export async function suggestAttractions({
  cityName,
  lon,
  lat,
  sessionToken,
  limit = 10,
  country = "gb",
}) {
  const token = requireToken();

  const params = new URLSearchParams({
    q: cityName,                 // anchor relevance to the city
    types: "poi",
    proximity: `${lon},${lat}`,
    country,
    limit: String(limit),
    session_token: sessionToken,
    access_token: token,
    poi_category: categories.join(","), // canonical IDs
  });

  const url = `${BASE}/suggest?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mapbox suggest failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const data = await res.json();
  const suggestions = data?.suggestions ?? [];

  // Normalize for your UI
  return suggestions.map((s) => ({
    id: s.mapbox_id,
    name: s.name,
    placeFormatted: s.place_formatted,
    distance: s.distance, // meters
    categories: s.poi_category_ids ?? [],
  }));
}

/**
 * Retrieve full details for one POI (for your modal).
 */
export async function retrievePlace({ mapboxId, sessionToken }) {
  const token = requireToken();

  const params = new URLSearchParams({
    session_token: sessionToken,
    access_token: token,
  });

  const url = `${BASE}/retrieve/${encodeURIComponent(mapboxId)}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mapbox retrieve failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const data = await res.json();
  const f = data?.features?.[0];
  const p = f?.properties;

  if (!f || !p) return null;

  return {
    id: p.mapbox_id,
    name: p.name,
    fullAddress: p.full_address,
    placeFormatted: p.place_formatted,
    lon: f.geometry?.coordinates?.[0],
    lat: f.geometry?.coordinates?.[1],
    categories: p.poi_category_ids ?? [],
    wheelchairAccessible: p?.metadata?.wheelchair_accessible ?? null,
    status: p?.operational_status ?? null,
  };
}
