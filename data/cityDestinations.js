import { RAW_DESTINATIONS } from "./mockDestinations";
import { extractCities } from "../utils/extractCities";

export const CITY_DESTINATIONS = extractCities(RAW_DESTINATIONS);