import { useState, useEffect } from "react";
import { searchUnsplashImages } from "../../api/unsplash/images";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export function useCityImages(destinations = [], attractions = {}, options = {}) {
  const [heroImages, setHeroImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const maxAttractionsPerCity = options.maxAttractionsPerCity || 2;
  const imagesPerQuery = options.imagesPerQuery || 2;
  // const cacheExpiryHours = options.cacheExpiryHours || 24;

  useEffect(() => {
    // 🔹 Only skip if BOTH destinations and attractions are empty
    const hasDestinations = Array.isArray(destinations) && destinations.length > 0;
    const hasAttractions = attractions && Object.keys(attractions).length > 0;

    if (!hasDestinations && !hasAttractions) return;

    async function fetchImages() {
      setLoadingImages(true);

      try {
        // Use destinations if available, otherwise fallback to grouped city names
        const citiesToFetch = hasDestinations
          ? destinations
          : Object.keys(attractions).map((cityName) => ({ name: cityName }));

        console.log("Cities for Unsplash fetch:", citiesToFetch);
        console.log("Attractions passed to hook:", attractions);

        const cityPromises = citiesToFetch.map(async (dest) => {
          const cityName = dest.name;
          const cityAttractions = attractions[cityName] || [];

          // Build queries: attraction-specific + generic city
          const attractionQueries = cityAttractions
            .slice(0, maxAttractionsPerCity)
            .map((a) => `${cityName} ${a.name} travel photography`);

          const genericQuery = `${cityName} city travel photography`;
          const queries = [...attractionQueries, genericQuery];

          console.log(`Queries for ${cityName}:`, queries);

          // 🔹 Optional caching logic here
          /*
          const cached = await AsyncStorage.getItem(`unsplash-${cityName}`);
          const cachedMeta = await AsyncStorage.getItem(`unsplash-${cityName}-meta`);
          if (cached && cachedMeta) {
            const ts = JSON.parse(cachedMeta).ts;
            if (Date.now() - ts < cacheExpiryHours * 60 * 60 * 1000) {
              return JSON.parse(cached);
            }
          }
          */

          // Fetch images for all queries
          const results = await Promise.all(
            queries.map(async (q) => {
              const images = await searchUnsplashImages(q);
              return images.slice(0, imagesPerQuery).map((r) => r.urls.small);
            })
          );

          const flatResults = results.flat();

          // 🔹 Optional caching save
          /*
          await AsyncStorage.setItem(`unsplash-${cityName}`, JSON.stringify(flatResults));
          await AsyncStorage.setItem(
            `unsplash-${cityName}-meta`,
            JSON.stringify({ ts: Date.now() })
          );
          */

          return flatResults;
        });

        const allImages = await Promise.all(cityPromises);
        setHeroImages(allImages.flat());
      } catch (err) {
        console.error("City image fetch failed:", err);
      } finally {
        setLoadingImages(false);
      }
    }

    // 🔹 Use JSON.stringify to ensure effect runs on deep object change
    fetchImages();
  }, [JSON.stringify(destinations), JSON.stringify(attractions)]);

  return { heroImages, loadingImages };
}
