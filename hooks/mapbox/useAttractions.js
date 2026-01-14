import { useEffect, useMemo, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { suggestAttractions } from "../../api/mapbox/searchBox";

// simple session token generator (good enough for now)
function makeSessionToken() {
  return `sess_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function useAttractions(city) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // new token when city changes
  const sessionToken = useMemo(() => makeSessionToken(), [city]);

  useEffect(() => {
    if (!city) {
      setAttractions([]);
      setError("");
      return;
    }

    const meta = CITY_META[city];
    if (!meta) {
      setError(`Unknown city: ${city}`);
      setAttractions([]);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const items = await suggestAttractions({
          cityName: city,
          lon: meta.lon,
          lat: meta.lat,
          sessionToken,
          limit: 10,
        });

        if (!cancelled) setAttractions(items);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load attractions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [city, sessionToken]);

  return { attractions, loading, error, sessionToken };
}
