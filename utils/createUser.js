import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createUser = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    provider: user.providerData[0]?.providerId ?? "google",
    createdAt: serverTimestamp(),
  });
};
