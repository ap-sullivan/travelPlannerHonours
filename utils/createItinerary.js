import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createItinerary = async (uid, tripDraft) => {
  if (!uid) throw new Error("Missing user id");

  // Reference the collection
  const itinerariesRef = collection(db, "users", uid, "itineraries");

  //  create a random ID with addoc
  const docRef = await addDoc(itinerariesRef, {
    season: tripDraft.season,
    destinations: tripDraft.destinations,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};