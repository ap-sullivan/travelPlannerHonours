import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Logo from "../assets/logo/logo.svg";

import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../constants/Colors";
import { signInWithGoogle } from "../utils/googleSignIn";
import { signUpWithEmail, signInWithEmail } from "../utils/emailAuth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

export default function LoginScreen({ setGuestMode, setHasProfile }) {
  const navigation = useNavigation();

  // input UI focus states
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // state and logic for email/pasword signup/login
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      let userCredential;

      if (mode === "signup") {
        userCredential = await signUpWithEmail(email, password);
      } else {
        userCredential = await signInWithEmail(email, password);
      }

      const user = userCredential.user;

      //  Check if the user has a completed profile
      const profileRef = doc(db, "users", user.uid, "profile", "preferences");
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        setHasProfile(false);
      } else {
        setHasProfile(profileSnap.data().hasCompletedSetup);
      }
    } catch (err) {
      Alert.alert("Auth error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // google login handler
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const userCredential = await signInWithGoogle();
      const loggedInUser = userCredential.user;

      const profileRef = doc(
        db,
        "users",
        loggedInUser.uid,
        "profile",
        "preferences",
      );
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists() || !profileSnap.data().hasCompletedSetup) {
        setHasProfile(false);
      } else {
        setHasProfile(true);
      }
      
    } catch (e) {
      console.error("Google sign-in error:", e);
      Alert.alert("Error", e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>

          <Logo width={180} height={180} />
        </View>

        <Text style={styles.title}>Welcome to PlanMyScotTrip</Text>
        <Text style={styles.subtitle}>
          Log in or sign up to save trips and unlock AI features
        </Text>

        {/* google login */}
        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <FontAwesome name="google" size={24} color="black" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

{/* TODO: MAKE THE FOCUS STATE ORANGE */}
        {/* Email signups */}
        <View style={[styles.inputWrapper, emailFocused && styles.focused]}>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={[styles.inputWrapper, passwordFocused && styles.focused]}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton onPress={handleEmailAuth} disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "signup"
              ? "Sign up with Email"
              : "Sign in with Email"}
        </PrimaryButton>

        <Pressable onPress={() => setGuestMode(true)}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>

        <Pressable
          onPress={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          <Text style={styles.toggleText}>
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  imageContainer: {
    display: "flex",
    alignItems: "center",
    width: "auto",
    height: 200,
    marginTop: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.primary900,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: Colors.gray600,
    textAlign: "center",
    marginBottom: 32,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: Colors.gray300,
    marginBottom: 24,
  },

  googleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: Colors.gray500,
  },

  inputWrapper: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray300,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginBottom: 12,
  },

  input: {
    fontSize: 14,
    color: Colors.primary900,
  },

  focused: {
    borderColor: Colors.primary500,
  },

  primaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primary700,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  primaryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  skipText: {
    marginTop: 20,
    textAlign: "center",
    color: Colors.gray700,
    fontSize: 13,
    marginBottom: 12,
  },

  toggleText: {
    textAlign: "center",
  }
});
