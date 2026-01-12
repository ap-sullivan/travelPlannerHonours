import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import StartScreen from "../../screens/StartScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SearchResultScreen from "../../screens/SearchResultsScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import Colors from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

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
          paddingBottom: 0,
          paddingTop: 0,

          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },

        tabBarIconStyle: { marginBottom: 0, marginTop: 0 },
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name={iconName} size={focused ? 26 : 22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={StartScreen} />
      <Tab.Screen name="Profile" component={SearchResultScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
