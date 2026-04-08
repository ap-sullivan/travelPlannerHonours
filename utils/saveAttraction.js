// util to save an attraction to a users itinerary in firestore


import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveAttraction = async (uid, itineraryId, attraction) => {
  if (!uid || !itineraryId) throw new Error("Missing uid or itineraryId");

  // create a reference to the attraction document in the users itinerary
  const ref = doc(
    db,
    "users",
    uid,
    "itineraries",
    itineraryId,
    "attractions",
    attraction.id
  );

  // spread the attraction data and add timestamp
  await setDoc(ref, {
    ...attraction,
    savedAt: serverTimestamp(),
  });
  
  return true;
};