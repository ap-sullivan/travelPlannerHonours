import { isRejectedCategory, isCoordMismatch } from "./wikiValidation";


export async function fetchWikiSmart(attraction) {
  const { name, city, lat, lon } = attraction;

  // exact name
  let result = await fetchWikiByTitle(name, lat, lon);
  if (result) return result;

//   name + city
  if (city) {
    result = await fetchWikiByTitle(`${name} ${city}`, lat, lon);
    if (result) return result;
  }

  return null;
  // return fetchWikiByCoords(lat, lon);
}


async function fetchWikiByTitle(query, lat, lon) {
  const searchUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query` +
    `&format=json` +
    `&origin=*` +
    `&list=search` +
    `&srsearch=${encodeURIComponent(query)}` +
    `&srlimit=1`;

  const searchRes = await fetch(searchUrl);
  const searchJson = await searchRes.json();

  const result = searchJson?.query?.search?.[0];
  if (!result) return null;

  const pageId = result.pageid;

  // Fetch full page by pageid with parameters
  const pageUrl =
    `https://en.wikipedia.org/w/api.php` +
    `?action=query` +
    `&format=json` +
    `&origin=*` +
    `&prop=pageimages|extracts|categories|coordinates` +
    `&pageids=${pageId}` +
    `&piprop=thumbnail` +
    `&pithumbsize=600` +
    `&exintro=1` +
    `&explaintext=1` +
    `&cllimit=20`;

  const pageRes = await fetch(pageUrl);
  const pageJson = await pageRes.json();

  const page = pageJson?.query?.pages?.[pageId];
  if (!page) return null;

  // validate coordinates are within the limist set in wikivalidation file and the categories arent blacklisted

  const wikiCoords = page.coordinates?.[0];
if (!wikiCoords) return null;

// Reject if categories are wrong
const categories =
  page.categories?.map(c => c.title) ?? [];

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
