import { useEffect, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { fetchCityAttractions } from "../../api/geoapify/places";
import { getSightseeingCategoryLabel } from "../../data/sightseeing/sightseeingCategoryLabels";


export function useAttractions(city) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) {
      setAttractions([]);
      return;
    }

    const meta = CITY_META[city];
    if (!meta) {
      setError(`Unknown city: ${city}`);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const raw = await fetchCityAttractions(meta);

      const normalized = raw

    //   filter out unnamed or blank attractions
  .filter(
    (f) =>
      typeof f.properties?.name === "string" &&
      f.properties.name.trim().length > 0
  )
  .map((f) => {
    const categories = f.properties.categories ?? [];

    return {
      id: f.properties.place_id,
      name: f.properties.name.trim(),
      subtitle: getSightseeingCategoryLabel(categories), 
      lat: f.properties.lat,
      lon: f.properties.lon,
      categories,
    };
  });
        if (!cancelled) setAttractions(normalized);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [city]);

  return { attractions, loading, error };
}
