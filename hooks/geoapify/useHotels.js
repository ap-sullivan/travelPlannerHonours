import { useEffect, useState } from "react";
import { CITY_META } from "../../data/cityMeta";
import { fetchCityHotels } from "../../api/geoapify/hotels";

export function useHotels(city) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city) {
      setHotels([]);
      return;
    }

    // validate city against meta first before making api call
    const meta = CITY_META[city];
    if (!meta) {
      setError(`Unknown city: ${city}`);
      return;
    }

    let cancelled = false;

    // fetch hotels from geoapify and normalise
    async function run() {
      try {
        setLoading(true);
        setError("");

        const raw = await fetchCityHotels({ ...meta });

        const normalized = raw
          .filter(
            (f) =>
              typeof f.properties?.name === "string" &&
              f.properties.name.trim().length > 0,
          )
          //   normalise for usable format and give fallbacks
          .map((f) => {
            const wikidataId = f.properties.wiki_and_media?.wikidata ?? null;

            return {
              id: f.properties.place_id,
              name: f.properties.name.trim(),
              brand: f.properties.brand ?? "",
              lat: f.properties.lat,
              lon: f.properties.lon,
              stars: f.properties.accommodation?.stars ?? 0,
              website: f.properties.website ?? "",
              contact: f.properties.contact ?? {},
              facilities: f.properties.facilities ?? {},
              hasWikiData: !!wikidataId,
              wikidataId,
              categories: [], 
              isFavourite: false, 
              subtitle: "", 
              description: "",
            };
          });
        //   filtering by min 4 stars
        //   .filter((h) => h.stars >= minStars);

        if (!cancelled) setHotels(normalized);
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

  return { hotels, loading, error };
}
