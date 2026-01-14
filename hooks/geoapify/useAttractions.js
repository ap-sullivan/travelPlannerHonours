import { useEffect, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { fetchCityAttractions } from "../../api/geoapify/places";

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

        const normalized = raw.map((f) => ({
          id: f.properties.place_id,
          name: f.properties.name || "Unnamed place",
          lat: f.properties.lat,
          lon: f.properties.lon,
          categories: f.properties.categories,
        }));

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
