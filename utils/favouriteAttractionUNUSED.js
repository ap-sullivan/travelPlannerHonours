// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "./firebase";

// export const saveAttraction = async (uid, attraction) => {
//   const ref = doc(
//     db,
//     "users",
//     uid,
//     "savedAttractions",
//     attraction.id
//   );

//   await setDoc(ref, {
//     id: attraction.id,
//     name: attraction.name,
//     city: attraction.city,
//     lat: attraction.lat,
//     lon: attraction.lon,
//     categories: attraction.categories ?? [],
//     savedAt: serverTimestamp(),
//   });
// };
