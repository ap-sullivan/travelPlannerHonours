// this hook fetches images for cities and their attractions from Unsplash, using city and attraction level and attraction-level queries

import { useState, useEffect } from "react";
import { searchUnsplashImages } from "../../api/unsplash/images";

export function useCityImages(
  destinations = [],
  attractions = {},
  options = {},
) {
  const [heroImages, setHeroImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const maxAttractionsPerCity = options.maxAttractionsPerCity || 2;
  const imagesPerQuery = options.imagesPerQuery || 2;

  useEffect(() => {
    // skip if no destinations or attractions
    const hasDestinations =
      Array.isArray(destinations) && destinations.length > 0;
    const hasAttractions = attractions && Object.keys(attractions).length > 0;

    if (!hasDestinations && !hasAttractions) return;

    // fetch images for each city and its attractions
    async function fetchImages() {
      setLoadingImages(true);

      try {
        // Use destinations if available, otherwise fallback to grouped city names
        const citiesToFetch = hasDestinations
          ? destinations
          : Object.keys(attractions).map((cityName) => ({ name: cityName }));

          // For each city, build queries for the city and its attractions, prioritising attractions
        const cityPromises = citiesToFetch.map(async (dest) => {
          const cityName = dest.name;
          const cityAttractions = attractions[cityName] || [];

          const attractionQueries = cityAttractions
            .slice(0, maxAttractionsPerCity)
            .map((a) => `${cityName} ${a.name} travel photography`);

          // Always include a generic city level query as a fallback
          const genericQuery = `${cityName} city travel photography`;
          const queries = [...attractionQueries, genericQuery];

          console.log(`Queries for ${cityName}:`, queries);

          // Fetch images for all queries
          const results = await Promise.all(
            queries.map(async (q) => {
              const images = await searchUnsplashImages(q);
              return images.slice(0, imagesPerQuery).map((r) => r.urls.small);
            }),
          );

          const flatResults = results.flat();

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

    // strigify to ensure effect runs on object change
    fetchImages();
  }, [JSON.stringify(destinations), JSON.stringify(attractions)]);

  return { heroImages, loadingImages };
}
