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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from "../constants/Colors";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import Carousel from "react-native-reanimated-carousel";
import { useCityImages } from "../hooks/unsplash/useCityImages";

import { auth } from "../utils/firebase";
import { httpsCallable } from "firebase/functions";
import { functions } from "../utils/firebase";

import { getSavedAttractions } from "../utils/getSavedAttractions";
import { removeSavedAttraction } from "../utils/removeSavedAttraction";
import { getItinerary } from "../utils/getItinerary";
import { getSavedHotel } from "../utils/getSavedHotel";
import { removeSavedHotel } from "../utils/removeSavedHotel";

function SummaryScreen({ route }) {
  const navigation = useNavigation();
  const { itineraryId, tapTime } = route.params;
  const user = auth.currentUser;

  const [attractions, setAttractions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // performance logging for testing
  useEffect(() => {
    if (tapTime !== undefined) {
      const renderTime = performance.now();
      const latency = renderTime - tapTime;
      console.log(`Render latency: ${latency.toFixed(1)} ms`);
    }
  }, [tapTime]);


  // data loading for accom and attractions
  useEffect(() => {
    const loadData = async () => {
      try {
        let attractionsData = [];
        let destinationsData = [];
        let hotelsData = [];

        if (user) {
          const data = await getSavedAttractions(user.uid, itineraryId);
          const itinerary = await getItinerary(user.uid, itineraryId);
          const acc = await getSavedHotel(user.uid, itineraryId);

          attractionsData = data || [];
          destinationsData = itinerary?.destinations || [];
          hotelsData = acc || [];
        } else {
          const savedJson = await AsyncStorage.getItem("guestSavedAttractions");
          const draftJson = await AsyncStorage.getItem("tripDraft");
          const accJson = await AsyncStorage.getItem("guestSavedHotels");

          attractionsData = savedJson ? JSON.parse(savedJson) : [];
          const draft = draftJson ? JSON.parse(draftJson) : {};
          destinationsData = draft?.destinations || [];
          hotelsData = accJson ? JSON.parse(accJson) : [];
        }

        setAttractions(attractionsData);
        setDestinations(destinationsData);
        setHotels(hotelsData);
      } catch (error) {
        console.error("Failed loading data:", error);
      }
    };

    loadData();
  }, [user, itineraryId]);

//  group attractions by city for UI
  const grouped = useMemo(() => {
    return attractions.reduce((acc, item) => {
      if (!acc[item.city]) acc[item.city] = [];
      acc[item.city].push(item);
      return acc;
    }, {});
  }, [attractions]);

// group hotels by city for UI
  const groupedHotels = useMemo(() => {
    return hotels.reduce((acc, item) => {
      if (!acc[item.city]) acc[item.city] = [];
      acc[item.city].push(item);
      return acc;
    }, {});
  }, [hotels]);

  // get list of cities for rendering
  const cities = Object.keys(grouped);

  // helper to get days of stay for city from destinations list
  const stayDays = (cityName) => {
    const dest = destinations.find((d) => d.name === cityName);
    return dest ? dest.days : null;
  };

  // fetch hero images using Unsplash hook 
  const { heroImages, loadingImages } = useCityImages(destinations, grouped);
  const width = Dimensions.get("window").width;


  // handlers for removing attraction
  const handleRemoveAttraction = async (id) => {
    try {
      if (user) {
        await removeSavedAttraction(user.uid, itineraryId, id);
        setAttractions((prev) => prev.filter((a) => a.id !== id));
      } else {
        const json = await AsyncStorage.getItem("guestSavedAttractions");
        const list = json ? JSON.parse(json) : [];

        const updated = list.filter((a) => a.id !== id);
        await AsyncStorage.setItem(
          "guestSavedAttractions",
          JSON.stringify(updated)
        );

        setAttractions(updated);
      }

      Alert.alert("Removed", "Attraction removed");
    } catch (err) {
      console.error(err);
    }
  };

  //  handlers for removing hotel
  const handleRemoveHotel = async (id) => {
    try {
      if (user) {
        await removeSavedHotel(user.uid, itineraryId, id);
        setHotels((prev) => prev.filter((a) => a.id !== id));
      } else {
        const json = await AsyncStorage.getItem("guestSavedHotels");
        const list = json ? JSON.parse(json) : [];

        const updated = list.filter((a) => a.id !== id);

        await AsyncStorage.setItem(
          "guestSavedHotels",
          JSON.stringify(updated)
        );

        setHotels(updated);
      }

      Alert.alert("Removed", "Hotel removed");
    } catch (err) {
      console.error(err);
    }
  };

  //  build input for AI screen based on current attractions, hotels, and destinations from state
const buildAIInput = () => {
  return destinations.map((dest) => ({
    name: dest.name,
    days: dest.days,
    season: dest.season, 
    hotel: groupedHotels[dest.name]?.[0] || null, 
    attractions: (grouped[dest.name] || []).map((a) => ({
      name: a.name, 
    })),
  }));
};

  // handler for Generate AI Itinerary button

  const handleGenerateAI = async () => {
  try {
    const data = buildAIInput();

    const generateFn = httpsCallable(functions, "generateItinerary");

    setLoadingAI(true);

    const response = await generateFn({
      destinations: data,
    });

    setLoadingAI(false);

    const itineraryText = response.data.itinerary;

    //  pass to next screen
    navigation.navigate("FinalItineraryScreen", {
      itinerary: itineraryText,
    });

  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Failed to generate itinerary");
  }
};

  return (
    <SafeAreaView style={style.container}>
      {loadingImages && <ActivityIndicator size="large" />}

      {heroImages.length > 0 && (
        <Carousel
          width={width}
          height={220}
          autoPlay
          autoPlayInterval={4000}
          data={heroImages}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        />
      )}

      <Text style={style.title}>Final Itinerary Summary</Text>

      <ScrollView style={{ padding: 16 }}>
        {cities.map((city, index) => (
          <View key={city}>
            <Text style={style.cityTitle}>
              {city} {stayDays(city) ? `(${stayDays(city)} days)` : ""}
            </Text>

            {/* Attractions */}
            {grouped[city].map((attraction) => (
              <View key={attraction.id} style={style.itemRow}>
                <Text style={style.text}>{attraction.name}</Text>

                <TouchableOpacity
                  onPress={() => handleRemoveAttraction(attraction.id)}
                >
                  <Feather name="x-circle" size={16} color={Colors.accent600} />
                </TouchableOpacity>
              </View>
            ))}

            {/* hotels */}
            {groupedHotels[city]?.length > 0 && (
              <>
              <View style={style.hotelTitle}>
               <MaterialIcons name="hotel" size={20 } color="black" /> <Text style={style.sectionSubtitle}>Stay </Text>
              </View>

                {groupedHotels[city].map((hotel) => (
                  <View key={hotel.id} style={style.itemRow}>
                    <Text style={style.text}>{hotel.name}</Text>

                    <TouchableOpacity
                      onPress={() => handleRemoveHotel(hotel.id)}
                    >
                      <Feather
                        name="x-circle"
                        size={16}
                        color={Colors.accent600}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {index < cities.length - 1 && <View style={style.line} />}
          </View>
        ))}

       
        <PrimaryButton style={{ marginTop: 24 }} onPress={handleGenerateAI}>
          {/* GENERATE ITINERARY <Feather name="zap" size={18} color="white" /> */}
            {loadingAI ? "Generating..." : "GENERATE ITINERARY"}
        </PrimaryButton>

      </ScrollView>
    </SafeAreaView>
  );
}

export default SummaryScreen;

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

  hotelTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 4,

  },

  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    // marginTop: 8,
    color: Colors.gray600,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  text: {
    flex: 1,
    marginRight: 8,
  },

  line: {
    height: 1,
    backgroundColor: Colors.gray300,
    marginVertical: 16,
  },
});