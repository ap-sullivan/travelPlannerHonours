// this function fetches attractions from Geoapify Places API based on the given latitude, longitude and radius

const BASE_URL = "https://api.geoapify.com/v2/places";

export async function fetchCityAttractions({ lat, lon, radius }) {
  const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GEOAPIFY_KEY");
  }

  const params = new URLSearchParams({
    categories: "entertainment.museum, entertainment.culture",
    filter: `circle:${lon},${lat},${radius}`,
    bias: `proximity:${lon},${lat}`,
    limit: "50",
    apiKey,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  // start timer for performance monitoring
  const startTime = performance.now();

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Geoapify error ${res.status}: ${text}`);
  }

  const data = await res.json();

  //  end timer and log results for performance monitoring
  const endTime = performance.now();

  console.log("Start Time:", startTime);
  console.log("End Time:", endTime);
  console.log(`API total time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`,);

  return data.features ?? [];
}
