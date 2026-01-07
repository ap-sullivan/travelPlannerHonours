export const extractCities = (results) => {
  return Array.from(
    new Set(
      results
        .map((r) => r.city)
        .filter(Boolean)
    )
  );
};