import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider} from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import StartScreen from "./screens/StartScreen";
import Colors from "./constants/Colors";

// navigation
import { NavigationContainer } from "@react-navigation/native";
import BottomNav from "./components/navigation/BottomNav";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

 
  if (!fontsLoaded) {
    return null;
  }


  return (
    <SafeAreaProvider>
  <View style={styles.rootScreen} onLayout={onLayoutRootView}>
  <NavigationContainer>
      <BottomNav />
  </NavigationContainer>
    </View>
</SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
});
