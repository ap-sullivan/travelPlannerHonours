import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getSavedAttractions = async (uid, itineraryId) => {
  if (!uid || !itineraryId) {
    throw new Error("Missing uid or itineraryId");
  }

  const attractionsRef = collection(
    db,
    "users",
    uid,
    "itineraries",
    itineraryId,
    "attractions"
  );

  const snapshot = await getDocs(attractionsRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
