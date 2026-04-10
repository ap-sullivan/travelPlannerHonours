import { useState, useEffect, useMemo } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CityPicker from "../components/ui/buttons/CityPicker";
import AppText from "../components/ui/textStyles/AppText";
import HotelListItem from "../components/ui/HotelListItem";
import { processHotels } from "../utils/hotelDataProcessing";
import { useHotels } from "../hooks/geoapify/useHotels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { saveHotel } from "../utils/saveHotel";
import HotelsMap from "../components/ui/maps/HotelsMap";
import { CITY_META } from "../data/cityMeta";
import { FAVOURITE_HOTELS } from "../data/hotels/favouriteHotels";

//TODO add in favourite hotels eventually and possibly info modal

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

  // mapbox logics
  const activeCity = city ?? "Edinburgh";
  const cityMeta = CITY_META[activeCity] ?? CITY_META["Edinburgh"];
    const mapCenter = [cityMeta.lon, cityMeta.lat];
  const mapZoom = cityMeta.mapboxZoom;

   // TODO: remove 4* minimum
  const { hotels = [], loading, error } = useHotels(city ?? "", 4);

  // bring in favourite hotels
  const favouriteHotels = useMemo(() => {
    return FAVOURITE_HOTELS[activeCity] ?? [];
  }, [activeCity]);

  const { list: numberedHotels, geojson: hotelsGeoJSON } = useMemo(() => {
  return processHotels({
    hotels,
    favouriteHotels,
  });
}, [hotels, favouriteHotels]);




  const handleSaveHotel = async (hotel) => {
    if (!itineraryId) return;

    const hotelData = {
      id: hotel.id,
      name: hotel.name,
      city: city ?? "",
      lat: hotel.lat,
      lon: hotel.lon,
      //   stars: hotel.stars,
      website: hotel.website ?? null,
      wikidataId: hotel.wikidataId ?? null,
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
            JSON.stringify(savedList),
          );
          console.log("Hotel saved to AsyncStorage:", hotelData);
        }
      }
      Alert.alert("Saved", `"${hotel.name}" added to your itinerary!`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save hotel");
    }
  };

  const handleNext = () => {
    navigation.navigate("Summary", { itineraryId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>Accommodation in {city ?? ""}</Text> */}

      {loading && <Text>Loading hotels...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <FlatList
        data={numberedHotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <HotelListItem
            index={item.displayIndex}
            title={item.name}
            // subtitle={`${item.subtitle} ${item.hasWikiData ? " (has WikiData)" : ""}`}
            onPressAdd={() => handleSaveHotel(item)}
          />
        )}
        ListEmptyComponent={<AppText>No hotels found.</AppText>}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        ListHeaderComponent={
          <View>
            <View style={styles.mapContainer}>
              <HotelsMap
                geojson={hotelsGeoJSON}
                center={mapCenter}
                zoom={mapZoom}
                onSelectHotel={(feature) =>
                  // TODO: crete hotel details modal and link to the favourite hotels json

                  openDetails({
                    id: feature.id,
                    name: feature.properties.name,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                  })
                }
              />
            </View>

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

             <AppText style={{ marginTop: 6, textAlign: "center" }}>
              Add a {(city ?? "City Not Found") + " Hotel to Your Itinerary"}
            </AppText>

           
      <PrimaryButton onPress={handleNext}>Next</PrimaryButton>
    
          </View>
        }
      />

    </SafeAreaView>
  );
}

export default AccommodationResultsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  title: { fontSize: 20, fontWeight: "bold", marginVertical: 16 },

  resultsContainer: {
   marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  mapContainer: {
    width: "auto",
    height: 220,
    marginTop: 6,
    borderRadius: 12,
    overflow: "hidden",
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
