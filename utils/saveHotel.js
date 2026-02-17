import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveHotel = async (uid, itineraryId, hotel) => {
  if (!uid || !itineraryId) throw new Error("Missing uid or itineraryId");

  const ref = doc(
    db,
    "users",
    uid,
    "itineraries",
    itineraryId,
    "hotels",
    hotel.id
  );

//   use merge:true to avoid overwriting existing data 
 await setDoc(ref, { ...hotel, savedAt: serverTimestamp() }, { merge: true });

  
  return true;
};