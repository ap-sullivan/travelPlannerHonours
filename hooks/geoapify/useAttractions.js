// this fetches and normalises attractions for a given city using the Geoapify places API, and applies some filtering of data including removing any POIs that I have blacklisted, and error handling

import { useEffect, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { fetchCityAttractions } from "../../api/geoapify/places";
import { getSightseeingCategoryLabel } from "../../data/sightseeing/sightseeingCategoryLabels";
import { isBlacklistedPOI } from "../../utils/geoapifyBlacklistValidator";


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

    // error handling - to prevent setting state on unmounted component 
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const raw = await fetchCityAttractions(meta);

const normalised = raw
  // must have a name
  .filter(
    (f) =>
      typeof f.properties?.name === "string" &&
      f.properties.name.trim().length > 0
  )

  //  normalise first by mappinh to standard attraction object format and extracting category label for subtitle
  .map((f) => {
    const categories = f.properties.categories ?? [];

    //  return normalised attraction object
    return {
      id: f.properties.place_id,
      name: f.properties.name.trim(),
      subtitle: getSightseeingCategoryLabel(categories),
      lat: f.properties.lat,
      lon: f.properties.lon,
      categories,
    };
  })

  //  then filter out blacklisted POIs
  .filter(
    (a) =>
      !isBlacklistedPOI({
        name: a.name,
        city,
      })
  );
  //  if not cancelled, set attractions state to normalised array
        if (!cancelled) setAttractions(normalised);
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

  // finally return the attractions, loading and error state for use in the app
  return { attractions, loading, error };
}
