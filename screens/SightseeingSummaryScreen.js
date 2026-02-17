import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { getSavedAttractions } from "../utils/getSavedAttractions";
import { getItinerary } from "../utils/getItinerary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";

import { auth } from "../utils/firebase";

function SightseeingSummaryScreen({ route }) {

     const navigation = useNavigation();
  const { itineraryId } = route.params;
  const user = auth.currentUser;

  const [attractions, setAttractions] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const handleRemoveAttraction = async (attractionId) => {
    try {
      if (user) {
        //  remove from firestore
        await removeSavedAttraction(user.uid, itineraryId, attractionId);
        setAttractions((prev) => prev.filter((a) => a.id !== attractionId));
        Alert.alert("Removed", "Attraction removed from your itinerary");
      } else {
        // Guest remove from async
        const json = await AsyncStorage.getItem("guestSavedAttractions");
        const savedList = json ? JSON.parse(json) : [];
        const updatedList = savedList.filter((a) => a.id !== attractionId);
        await AsyncStorage.setItem(
          "guestSavedAttractions",
          JSON.stringify(updatedList),
        );
        setAttractions(updatedList);
        Alert.alert("Removed", "Attraction removed from your itinerary");
      }
    } catch (err) {
      console.error("Failed to remove attraction", err);
      Alert.alert("Error", "Could not remove attraction");
    }
  };

  useEffect(() => {
    async function load() {
      try {
        if (user) {
          const data = await getSavedAttractions(user.uid, itineraryId);
          setAttractions(data);

          const itinerary = await getItinerary(user.uid, itineraryId);
          setDestinations(itinerary?.destinations || []);
        } else {
          const json = await AsyncStorage.getItem("guestSavedAttractions");
          setAttractions(json ? JSON.parse(json) : []);

          const draftJson = await AsyncStorage.getItem("tripDraft");
          const draft = draftJson ? JSON.parse(draftJson) : {};
          setDestinations(draft.destinations || []);
        }
      } catch (err) {
        console.error("Failed to load attractions or destinations", err);
      }
    }

    load();
  }, [user, itineraryId]);

  //   group attractions by city for UI
  const grouped = attractions.reduce((acc, item) => {
    if (!acc[item.city]) acc[item.city] = [];
    acc[item.city].push(item);
    return acc;
  }, {});

  const cities = Object.keys(grouped);

  const stayDays = (cityName) => {
    const dest = destinations.find((d) => d.name === cityName);
    return dest ? dest.days : null;
  };

  const handleNext = () => {
  navigation.navigate("AccommodationResults", { itineraryId });
};

  return (
    <SafeAreaView style={style.container}>
      <View>
        <Text style={style.title}>Your Sightseeing Summary</Text>
      </View>
      <ScrollView style={{ padding: 32 }}>
  {cities.map((city, index) => (
    <View key={city}>
      <Text style={style.cityTitle}>
        {city} {stayDays(city) ? `(${stayDays(city)} days)` : ""}
      </Text>

      {grouped[city].map((attraction) => (
        <View key={attraction.id} style={style.attractionItem}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={style.attractionText}
          >
            {attraction.name}
          </Text>

          <TouchableOpacity
            onPress={() => handleRemoveAttraction(attraction.id)}
            style={style.removeButton}
          >
            <Feather name="x-circle" size={16} color={Colors.accent600} />
          </TouchableOpacity>
        </View>
      ))}

     
      {index < cities.length - 1 && (
        <View style={style.divider}>
          <View style={style.line} />
        </View>
      )}
    </View>
  ))}

   <PrimaryButton style={{marginTop: 24}}
    onPress={handleNext}
      >
         Move to Accommodation
         
      </PrimaryButton>
</ScrollView>

    </SafeAreaView>
  );
}

export default SightseeingSummaryScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  cityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 6,
  },

  attractionItem: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },

  attractionText: {
    marginRight: 8,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
    marginTop: 16,
  },
});
