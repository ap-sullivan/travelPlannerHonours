import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getItinerary(userId, itineraryId) {
  const docRef = doc(db, "itineraries", userId, "trips", itineraryId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data();
}