// utility function for email authentication using firebase auth - includes sign up and sign in functions

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUser } from "./createUser";

// sign up with email/pswd
export const signUpWithEmail = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUser(cred.user);
  return cred;
};

// sign in with email/pswd
export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
