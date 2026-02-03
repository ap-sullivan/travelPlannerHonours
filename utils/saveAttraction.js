import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveAttraction = async (uid, itineraryId, attraction) => {
  if (!uid || !itineraryId) throw new Error("Missing uid or itineraryId");

  const ref = doc(
    db,
    "users",
    uid,
    "itineraries",
    itineraryId,
    "attractions",
    attraction.id
  );

  // We spread the attraction data and add the timestamp
  await setDoc(ref, {
    ...attraction,
    savedAt: serverTimestamp(),
  });
  
  return true;
};