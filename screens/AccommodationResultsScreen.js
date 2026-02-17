import { useState, useEffect, useMemo } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CityPicker from "../components/ui/buttons/CityPicker";
import AppText from "../components/ui/textStyles/AppText";
import HotelListItem from "../components/ui/HotelListItem";
import { useHotels } from "../hooks/geoapify/useHotels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { saveHotel } from "../utils/saveHotel";

function AccommodationResultsScreen() {
  const [city, setCity] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [itineraryId, setItineraryId] = useState(null);

  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    async function initScreen() {
      try {
        const [storedId, storedDraft] = await Promise.all([
          AsyncStorage.getItem("activeItineraryId"),
          AsyncStorage.getItem("tripDraft"),
        ]);

        if (storedId) setItineraryId(storedId);

        if (storedDraft) {
          const trip = JSON.parse(storedDraft);
          setDestinations(trip.destinations);
          if (trip.destinations.length > 0 && !city) {
            setCity(trip.destinations[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to initialize:", err);
      }
    }

    initScreen();
  }, []);

  const { hotels, loading, error } = useHotels(city ?? "", 4); // min 4-star

  const handleSaveHotel = async (hotel) => {
    if (!itineraryId) return;

    const hotelData = {
      id: hotel.id,
      name: hotel.name,
      city: city ?? "",
      lat: hotel.lat,
      lon: hotel.lon,
    //   stars: hotel.stars,
        website: hotel.website,
        wikidataId: hotel.wikidataId,
    };

    try {
      if (user) {
        await saveHotel(user.uid, itineraryId, hotelData);
      } else {
        const existingJson = await AsyncStorage.getItem("guestSavedHotels");
        const savedList = existingJson ? JSON.parse(existingJson) : [];
        if (!savedList.find((item) => item.id === hotel.id)) {
          savedList.push({ ...hotelData, savedAt: Date.now() });
          await AsyncStorage.setItem(
            "guestSavedHotels",
            JSON.stringify(savedList)
          );
        }
      }
      Alert.alert("Saved", `"${hotel.name}" added to your itinerary!`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save hotel");
    }
  };

  const handleNext = () => {
    navigation.navigate("AccommodationSummary", { itineraryId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Accommodation in {city ?? ""}</Text>

      <View style={styles.resultsContainer}>
        {destinations.map((d) => (
          <CityPicker
            key={d.id}
            isSelected={city === d.name}
            onPress={() => setCity(d.name)}
          >
            {d.name}
          </CityPicker>
        ))}
      </View>

      {loading && <Text>Loading hotels...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <HotelListItem
            index={index + 1}
            title={item.name}
            subtitle={`${item.hasWikiData ? " (has WikiData)" : ""}`}
            onPressAdd={() => handleSaveHotel(item)}
          />
        )}
        ListEmptyComponent={<AppText>No hotels found.</AppText>}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      />

      <PrimaryButton onPress={handleNext}>Next</PrimaryButton>
    </SafeAreaView>
  );
}

export default AccommodationResultsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },
  resultsContainer: { marginBottom: 16, flexDirection: "row", flexWrap: "wrap" },
});
