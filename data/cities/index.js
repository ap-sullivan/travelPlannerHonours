// data/cities/index.js
import { RAW_DESTINATIONS } from "../destinations";
import { extractCities } from "../../utils/extractCities";
import { CITY_META } from "../cityMeta";

export const CITY_DESTINATIONS = extractCities(RAW_DESTINATIONS);
export const CITIES = Object.keys(CITY_DESTINATIONS);
export { CITY_META };
