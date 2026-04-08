// custom hook to initialise the itinerary state on the sightseeing results screen - grabs stored itinerary id and trip draft from async storage and sets the state accordingly

import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function useInitialiseItinerary(setItineraryId, setDestinations, setCity, city) {
  useEffect(() => {
    async function initScreen() {
      try {
         // Grab info from storage
        const [storedId, storedDraft] = await Promise.all([
          AsyncStorage.getItem("activeItineraryId"),
          AsyncStorage.getItem("tripDraft"),
        ]);

         //Set the ID state so handleSaveAttraction knows where to save
        if (storedId) {
          setItineraryId(storedId);
        }

         // set the destinations and default city
        if (storedDraft) {
          const trip = JSON.parse(storedDraft);
          setDestinations(trip.destinations);

            // Default to first destination if one isn't already set
          if (trip.destinations.length > 0 && !city) {
            setCity(trip.destinations[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to initialize search results:", err);
      }
    }

    initScreen();
  }, []);
}