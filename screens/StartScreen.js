import { useState, useEffect } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import DestinationPicker from "../components/forms/DestinationPicker";
import SeasonPicker from "../components/forms/SeasonPicker";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import AppText from "../components/ui/textStyles/AppText";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createItinerary } from "../utils/createItinerary";
import { getAuth } from "firebase/auth";

const MIN_DAYS = 1;
const MAX_DESTINATIONS = 4;

function StartScreen({ navigation }) {
  const [season, setSeason] = useState(null);
  const [destinations, setDestinations] = useState([
    { id: "1", name: "", days: 1 },
    { id: "2", name: "", days: 1 },
  ]);

  // TODO: REMOVE??
  const [city, setCity] = useState(null);

  const [itineraryId, setItineraryId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    AsyncStorage.getItem("activeItineraryId").then(setItineraryId);
  }, []);

  // Add a new destination state manage

  // previous is guaranteed to be the latest state
  const addDestination = () => {
    setDestinations((prev) => {
      // limit max destinations to globa variable set above and return to prev state if hit
      if (prev.length >= MAX_DESTINATIONS) {
        return prev;
      }
      // if not hit max, add a new destination with unique id, empty name and min days
      return [
        ...prev,
        {
          id: String(Date.now()),
          name: "",
          days: MIN_DAYS,
        },
      ];
    });
  };

  // remove destination base don id
  const removeDestination = (id) => {
    setDestinations((prev) => {
      // make susre at least one destination
      if (prev.length === 1) return prev;
      // if more than one, filter out the one with the matching id
      return prev.filter((d) => d.id !== id);
    });
  };


  // save to async storage and firestore
  async function handleStartPlanning() {
  try {
    if (!user) {
      Alert.alert(
        "Sign in required",
        "Please log in to start planning a trip."
      );
      return;
    }

    // Clean and validate data
    const cleanedDestinations = destinations
      .filter((d) => d.name.trim().length > 0)
      .map((d) => ({
        id: d.id,
        name: d.name.trim(),
        days: d.days,
      }));

    if (cleanedDestinations.length === 0) {
      console.warn("No destinations entered");
      return;
    }

    const totalDays = cleanedDestinations.reduce(
      (sum, d) => sum + (d.days || 0),
      0
    );

    const payload = {
      version: 1,
      season,
      destinations: cleanedDestinations,
      totalDays,
      lastUpdated: Date.now(),
    };

    // create itinerary in firestore
    const itineraryId = await createItinerary(user.uid, payload);

    // Track active itinerary
    await AsyncStorage.setItem(
      "activeItineraryId",
      itineraryId
    );

    // local draft
    await AsyncStorage.setItem(
      "tripDraft",
      JSON.stringify(payload)
    );

    navigation.navigate("SearchResults");
  } catch (err) {
    console.error("Failed to save trip", err);
  }
}

  return (
    <SafeAreaView style={style.container}>
      {/* moves UI out of the way when keyboard appears */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Tap anywhere on the screen to dismiss keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            // Taps in empty space dismisses keyboard
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            //  scrollbar on scroll hidden
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View style={style.imageContainer}>
                <Image
                  style={style.image}
                  source={require("../assets/images/placeholder.jpg")}
                ></Image>
              </View>
              <View style={style.destinationPickerContainer}>
                {destinations.map((d, index) => (
                  <DestinationPicker
                    key={d.id}
                    label={`Destination ${index + 1}`}
                    days={d.days}
                    name={d.name}
                    onNameChange={(nextName) =>
                      setDestinations((prev) =>
                        prev.map((x) =>
                          x.id === d.id ? { ...x, name: nextName } : x,
                        ),
                      )
                    }
                    onDaysChange={(nextDays) =>
                      setDestinations((prev) =>
                        prev.map((x) =>
                          x.id === d.id ? { ...x, days: nextDays } : x,
                        ),
                      )
                    }
                    onRemove={() => removeDestination(d.id)}
                    canRemove={destinations.length > 1}
                  />
                ))}
              </View>

              <View style={style.addDestinationContainer}>
                <AppText
                  style={{
                    color: Colors.primary700,
                    marginRight: 8,
                    marginBottom: 6,
                    fontWeight: "500",
                  }}
                >
                  Add another destination
                </AppText>
                <Pressable onPress={addDestination} hitSlop={8}>
                  <Feather
                    name="plus-circle"
                    size={16}
                    color={Colors.accent600}
                  />
                </Pressable>
              </View>

              <AppText style={{ marginLeft: 2 }}>
                When are you planning on travelling?
              </AppText>
              <View style={style.seasonPickerContainer}>
                <SeasonPicker
                  isSelected={season === "Spring"}
                  onPress={() =>
                    setSeason(season === "Spring" ? null : "Spring")
                  }
                >
                  Spring
                </SeasonPicker>
                <SeasonPicker
                  isSelected={season === "Summer"}
                  onPress={() =>
                    setSeason(season === "Summer" ? null : "Summer")
                  }
                >
                  Summer
                </SeasonPicker>
                <SeasonPicker
                  isSelected={season === "Autumn"}
                  onPress={() =>
                    setSeason(season === "Autumn" ? null : "Autumn")
                  }
                >
                  Autumn
                </SeasonPicker>
                <SeasonPicker
                  isSelected={season === "Winter"}
                  onPress={() =>
                    setSeason(season === "Winter" ? null : "Winter")
                  }
                >
                  Winter
                </SeasonPicker>
              </View>
            </View>

            <View style={style.startButtonContainer}>
              <PrimaryButton onPress={handleStartPlanning}>
                START PLANNING
              </PrimaryButton>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default StartScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    width: "auto",
    height: 200,
    marginTop: 6,

    // marginHorizontal: 20,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  destinationPickerContainer: {
    marginTop: 32,
  },

  addDestinationContainer: {
    flexDirection: "row",
    marginVertical: 16,
    marginLeft: 2,
  },

  seasonPickerContainer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  startButtonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
});
