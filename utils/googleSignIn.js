import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";
import { createUser } from "./createUser";


GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const signInWithGoogle = async () => {
  await GoogleSignin.signOut();

  const result = await GoogleSignin.signIn();
// console.log("sign-in result:", result);

const idToken = result?.data?.idToken;

if (!idToken) {
  throw new Error("No ID token returned from Google");
}

const credential = GoogleAuthProvider.credential(idToken);
 const userCredential = await signInWithCredential(auth, credential);

//  check if user has been added to db previously
  if (userCredential._tokenResponse?.isNewUser) {
    await createUser(userCredential.user);
  }

  return userCredential;


};
