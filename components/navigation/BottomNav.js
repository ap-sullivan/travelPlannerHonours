import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StartScreen from "../../screens/StartScreen";
import SearchResultsScreen from "../../screens/SearchResultsScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import Colors from "../../constants/Colors";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Define the stack for the Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Start" component={StartScreen} />
      <HomeStack.Screen name="SearchResults" component={SearchResultsScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  );
}

export default function BottomNav() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        safeAreaInsets: { bottom: insets.bottom + 12 },

        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          height: 60,
          borderRadius: 15,
          backgroundColor: "#fff",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },

        tabBarItemStyle: {
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarActiveTintColor: Colors.primary700,
        tabBarInactiveTintColor: Colors.gray500,

        tabBarIcon: ({ color, focused }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = "search";
          if (route.name === "Profile") iconName = "user";
          if (route.name === "Settings") iconName = "settings";

          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Feather
                name={iconName}
                size={focused ? 26 : 22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      {/* Tabs */}
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
