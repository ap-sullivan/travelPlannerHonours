import { GEOAPIFY_BLACKLIST } from "../data/sightseeing/geoapifyBlacklist";

export function isBlacklistedPOI({
  name = "",
  city,
}) {
  const n = name.toLowerCase().trim();


  if (city && GEOAPIFY_BLACKLIST[city]) {
    if (
      GEOAPIFY_BLACKLIST[city].some(
        x => x.toLowerCase() === n
      )
    ) {
      return true;
    }
  }

  return false;
}
