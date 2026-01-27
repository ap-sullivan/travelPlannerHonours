import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

import Colors from "./constants/Colors";

import Mapbox from "@rnmapbox/maps";

// navigation
import { NavigationContainer } from "@react-navigation/native";
import BottomNav from "./components/navigation/BottomNav";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import LoginScreen from "./screens/LoginScreen";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    </Stack.Navigator>
  );
}

const AuthStack = createNativeStackNavigator();

function AuthNavigator({ setGuestMode }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => <LoginScreen {...props} setGuestMode={setGuestMode} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

// keep splash screen visible while resources fetchd
SplashScreen.preventAutoHideAsync();

// set mapbox
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

export default function App() {
  const [guestMode, setGuestMode] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!authChecked || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.rootScreen} onLayout={onLayoutRootView}>
        <NavigationContainer>
          {user || guestMode ? (
            <BottomNav HomeStack={HomeStack} />
          ) : (
            <AuthNavigator setGuestMode={setGuestMode} />
          )}
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
