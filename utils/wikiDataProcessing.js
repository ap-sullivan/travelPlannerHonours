// validateWikiPage checks categories and coordinates before returning structured data

import { isRejectedCategory, isCoordMismatch } from "./wikiValidation";

export function validateWikiPage(page, { lat, lon }) {
  // validate coordinates are within the limit set in wikivalidation file and the categories arent blacklisted

  const wikiCoords = page.coordinates?.[0];
  if (!wikiCoords) return null;

  // Reject if categories are wrong
  const categories =
    page.categories?.map((c) => c.title) ?? [];

  if (isRejectedCategory(categories)) return null;

  // Reject if out of range
  if (
    isCoordMismatch(
      { lat: wikiCoords.lat, lon: wikiCoords.lon },
      { lat, lon }
    )
  ) {
    return null;
  }

  return {
    title: page.title,
    extract: page.extract,
    thumbnail: page.thumbnail?.source ?? null,
    url: `https://en.wikipedia.org/?curid=${page.pageid}`,
  };
}