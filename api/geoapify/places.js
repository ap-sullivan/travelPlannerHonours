const BASE_URL = "https://api.geoapify.com/v2/places";

export async function fetchCityAttractions({ lat, lon, radius }) {
  const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GEOAPIFY_KEY");
  }

  const params = new URLSearchParams({
    categories: "tourism.sights",
    filter: `circle:${lon},${lat},${radius}`,
    bias: `proximity:${lon},${lat}`,
    limit: "50",
    apiKey,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Geoapify error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.features ?? [];
}
