const BASE_URL = "https://api.geoapify.com/v2/places";


export async function fetchCityHotels({ lat, lon, radius }) {

  const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GEOAPIFY_KEY");
  }

  const params = new URLSearchParams({
    categories: "accommodation.hotel",
    filter: `circle:${lon},${lat},${radius}`,
    bias: `proximity:${lon},${lat}`,
    limit: "20", 
    apiKey,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Geoapify error ${res.status}: ${text}`);
  }

  const data = await res.json();
  
const hotels = data.features ?? [];
return hotels;
}
