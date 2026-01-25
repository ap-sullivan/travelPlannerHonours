import { View, Button, Alert } from "react-native";
import { signInWithGoogle } from "../utils/googleSignIn";

export default function LoginScreen() {
  const handleLogin = async () => {
  

    try {

      const result = await signInWithGoogle();
 
    } catch (e) {
      console.error("Google sign-in error:", e);
      Alert.alert("Error", e.message ?? "Unknown error");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button title="Sign in with Google" onPress={handleLogin} />
    </View>
  );
}
