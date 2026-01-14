import { RAW_DESTINATIONS } from "./destinations";
import { extractCities } from "../utils/extractCities";

export const CITY_DESTINATIONS = extractCities(RAW_DESTINATIONS);