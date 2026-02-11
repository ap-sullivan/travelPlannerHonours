import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

export default function SettingsScreen({ setHasProfile }) {
  const navigation = useNavigation();

  const handleSkip = async () => {
    if (auth.currentUser) {
      const profileRef = doc(db, "users", auth.currentUser.uid, "profile", "preferences");
      await setDoc(profileRef, { hasCompletedSetup: false }, { merge: true });
    }

    setHasProfile(true);
    navigation.replace("Start");
  };

  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <Pressable onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  skipText: { marginTop: 20, color: "blue" },
});
