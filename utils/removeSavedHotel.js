// util to remove a saved accommodation from Firestore in SightseeingSummaryScreen


import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const removeSavedHotel = async (userId, itineraryId, hotelId) => {
  try {
    const ref = doc(
      db,
      "users",
      userId,
      "itineraries",
      itineraryId,
      "hotels",
      hotelId
    );

    await deleteDoc(ref);

    console.log("Firestore hotel removed:", hotelId);
  } catch (error) {
    console.error("Failed to remove hotel from Firestore:", error);
    throw error; 
  }
};