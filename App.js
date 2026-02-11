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
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({ isFirstTime, setHasProfile }) {
  return (
    <Stack.Navigator
      initialRouteName={isFirstTime ? "Settings" : "Start"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen
        name="Settings"
        children={(props) => (
          <SettingsScreen {...props} setHasProfile={setHasProfile} />
        )}
      />
    </Stack.Navigator>
  );
}

function AuthNavigator({ setGuestMode, setHasProfile }) {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            setGuestMode={setGuestMode}
            setHasProfile={setHasProfile}
          />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

// keep splash screen visible while resources fetched
SplashScreen.preventAutoHideAsync();

// set mapbox
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

export default function App() {
  const [guestMode, setGuestMode] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [hasOpenedApp, setHasOpenedApp] = useState(null);
  const [hasProfile, setHasProfile] = useState(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    const checkFirstOpen = async () => {
      const opened = await AsyncStorage.getItem("hasOpenedApp");
      if (!opened) {
        await AsyncStorage.setItem("hasOpenedApp", "true");
        setHasOpenedApp(false);
      } else {
        setHasOpenedApp(true);
      }
    };

    checkFirstOpen();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setHasProfile(null); // important reset on logout
      return;
    }

    const checkProfile = async () => {
      try {
        const profileRef = doc(db, "users", user.uid, "profile", "preferences");

        const profileSnap = await getDoc(profileRef);

        setHasProfile(profileSnap.exists());
      } catch (err) {
        console.error("Error fetching profile:", err);
        setHasProfile(false); // safe fallback
      }
    };

    checkProfile();
  }, [user]);

  //  hide splash once fonts loaded, auth state checked, and first open status determined
  const onLayoutRootView = useCallback(async () => {
    if (
      fontsLoaded &&
      authChecked &&
      hasOpenedApp !== null &&
      (!user || hasProfile !== null)
    ) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authChecked, hasOpenedApp, user, hasProfile]);

  console.log("Navigation State - User:", !!user, " Guest:", guestMode);

  if (
    !fontsLoaded ||
    !authChecked ||
    hasOpenedApp === null ||
    (user && hasProfile === null)
  ) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.rootScreen} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user && !guestMode ? (
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    setGuestMode={setGuestMode}
                    setHasProfile={setHasProfile}
                  />
                )}
              </Stack.Screen>
            ) : hasProfile === false ? (
              <Stack.Screen name="Settings">
                {(props) => (
                  <SettingsScreen {...props} setHasProfile={setHasProfile} />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="AppHome">
                {(props) => (
                  <HomeStack {...props} setHasProfile={setHasProfile} />
                )}
              </Stack.Screen>
            )}
          </Stack.Navigator>
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
