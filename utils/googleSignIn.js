import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";


GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const signInWithGoogle = async () => {
  await GoogleSignin.signOut();

  const result = await GoogleSignin.signIn();
console.log("Google sign-in result:", result);

const idToken = result?.data?.idToken;

if (!idToken) {
  throw new Error("No ID token returned from Google");
}

const credential = GoogleAuthProvider.credential(idToken);
return signInWithCredential(auth, credential);


};
