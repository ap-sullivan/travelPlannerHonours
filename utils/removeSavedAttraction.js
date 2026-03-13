// util to remove a saved attraction from Firestore in SightseeingSummaryScreen

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const removeSavedAttraction = async (userId, itineraryId, attractionId) => {
  try {
    const ref = doc(
      db,
      "users",
      userId,
      "itineraries",
      itineraryId,
      "attractions",
      attractionId
    );

    await deleteDoc(ref);

    console.log("Firestore attraction removed:", attractionId);
  } catch (error) {
    console.error("Failed to remove attraction from Firestore:", error);
    throw error; 
  }
};