import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { signInWithGoogle } from "../utils/googleSignIn";

export default function LoginScreen({ setGuestMode }) {
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error("Google sign-in error:", e);
      Alert.alert("Error", e.message ?? "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Welcome to PlanMyScotTrip</Text>
        <Text style={styles.subtitle}>
          Log in or sign up to save trips and unlock AI features
        </Text>

        {/* Google Button */}
        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <Feather name="google" size={18} color="#000" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Email Inputs */}
        <View
          style={[
            styles.inputWrapper,
            emailFocused && styles.focused,
          ]}
        >
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={styles.input}
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            passwordFocused && styles.focused,
          ]}
        >
          <TextInput
            placeholder="Password"
            secureTextEntry
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            style={styles.input}
          />
        </View>

        {/* Email Action Button (wire logic later) */}
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Sign up with Email</Text>
        </Pressable>

        {/* Skip */}
        <Pressable onPress={() => setGuestMode(true)}>
          <Text style={styles.skipText}>Skip for now</Text>
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
    color: Colors.gray600,
    fontSize: 13,
  },
});
