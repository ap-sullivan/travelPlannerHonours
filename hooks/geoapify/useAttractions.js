import { useEffect, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { fetchCityAttractions } from "../../api/geoapify/places";
import { getSightseeingCategoryLabel } from "../../data/sightseeing/sightseeingCategoryLabels";
import { isBlacklistedPOI } from "../../utils/geoapifyBlacklistValidator";
// import { GEOAPIFY_BLACKLIST } from "../../data/sightseeing/geoapifyBlacklist";


export function useAttractions(city) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) {
      setAttractions([]);
      return;
    }

    // validate city before making call

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
  // 1️⃣ must have a name
  .filter(
    (f) =>
      typeof f.properties?.name === "string" &&
      f.properties.name.trim().length > 0
  )

  // 2️⃣ normalize first
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
  })


  //  exact-name blacklist (city aware)
  .filter(
    (a) =>
      !isBlacklistedPOI({
        name: a.name,
        city,
      })
  );

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
