// util to fetch saved attractions for a user and itinerary from Firestore

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getSavedHotel = async (uid, itineraryId) => {
  if (!uid || !itineraryId) {
    throw new Error("Missing uid or itineraryId");
  }

  const hotelsRef = collection(
    db,
    "users",
    uid,
    "itineraries",
    itineraryId,
    "hotels"
  );

  const snapshot = await getDocs(hotelsRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
