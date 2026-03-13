// Util to reset guest itinerary data from AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";


export const resetGuestItinerary = async () => {
  try {
    await AsyncStorage.removeItem("guestSavedAttractions");
    await AsyncStorage.removeItem("activeItineraryId");
    await AsyncStorage.removeItem("tripDraft");
    console.log("Guest itinerary reset");
  } catch (err) {
    console.error("Failed to reset guest itinerary:", err);
  }
};
