import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { getSavedAttractions } from "../utils/getSavedAttractions";
import { getItinerary } from "../utils/getItinerary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import Carousel from "react-native-reanimated-carousel";
import { useCityImages } from "../hooks/unsplash/useCityImages";

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

  //  load data on mount - attractions + destinations for city names and days

 useEffect(() => {
  const loadData = async () => {
    try {
      let attractionsData = [];
      let destinationsData = [];

      if (user) {
        const data = await getSavedAttractions(user.uid, itineraryId);
        const itinerary = await getItinerary(user.uid, itineraryId);

        console.log("SCREEN: Attractions from Firestore:", data?.length, data);
        console.log("SCREEN: Destinations from Firestore:", itinerary?.destinations?.length, itinerary?.destinations);

        attractionsData = data || [];
        destinationsData = itinerary?.destinations || [];
      } else {
        const savedJson = await AsyncStorage.getItem("guestSavedAttractions");
        const draftJson = await AsyncStorage.getItem("tripDraft");

        attractionsData = savedJson ? JSON.parse(savedJson) : [];
        const draft = draftJson ? JSON.parse(draftJson) : {};
        destinationsData = draft?.destinations || [];
      }
 
      setAttractions(attractionsData);
      setDestinations(destinationsData);

    } catch (error) {
      console.error("SCREEN: Failed loading data:", error);
    }
  };

  loadData();
}, [user, itineraryId]);

  //   group attractions by city for UI
  const grouped = useMemo(() => {
    return attractions.reduce((acc, item) => {
      if (!acc[item.city]) acc[item.city] = [];
      acc[item.city].push(item);
      return acc;
    }, {});
  }, [attractions]);

  const cities = Object.keys(grouped);

  const stayDays = (cityName) => {
    const dest = destinations.find((d) => d.name === cityName);
    return dest ? dest.days : null;
  };

  console.log("DESTINATIONS TYPE:", Array.isArray(destinations));
console.log("DESTINATIONS VALUE:", destinations);
console.log("GROUPED VALUE:", grouped);

  const { heroImages, loadingImages } = useCityImages(destinations, grouped);

  const width = Dimensions.get("window").width;

  const handleNext = () => {
    navigation.navigate("AccommodationResults", { itineraryId });
  };

 useEffect(() => {
  async function checkCache() {
    try {
      // List all keys (optional, for debugging)
      const keys = await AsyncStorage.getAllKeys();
      console.log("All AsyncStorage keys:", keys);

      // Check a specific city cache
      const city = "Glasgow"; // change to your city
      const cachedData = await AsyncStorage.getItem(`unsplash-${city}`);
      const cachedMeta = await AsyncStorage.getItem(`unsplash-${city}-meta`);

      console.log(`${city} cached images:`, cachedData ? JSON.parse(cachedData) : "none");
      console.log(`${city} cache meta:`, cachedMeta ? JSON.parse(cachedMeta) : "none");
    } catch (err) {
      console.error("Error reading AsyncStorage cache:", err);
    }
  }

  checkCache();
}, []);


  return (
    <SafeAreaView style={style.container}>
      

      {loadingImages && <ActivityIndicator size="large" />}

{/* TODO : add pagination and image overlay to match branding */ }
      {heroImages.length > 0 && (
        <Carousel
          width={width}
          height={220}
          autoPlay
          autoPlayInterval={4000}
          data={heroImages}
          scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}
        />
      )}

      <Text style={style.title}>Your Sightseeing Summary</Text>

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

        <PrimaryButton style={{ marginTop: 24 }} onPress={handleNext}>
          Move to Accommodation
        </PrimaryButton>
        
              <PrimaryButton style={{ marginTop: 12 }}
              // onPress={}
              >
          Skip to Transport (add later)
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

  cityImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
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
