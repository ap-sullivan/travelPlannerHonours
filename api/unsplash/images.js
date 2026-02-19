// unsplash API call for fetching images based on city / attractiomn

const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function searchUnsplashImages(query) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=3&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    const data = await response.json();
    return data.results;

  } catch (error) {
    console.error("Unsplash error:", error);
    return [];
  }
}

