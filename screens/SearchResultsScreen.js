import { useState, useMemo, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CityPicker from "../components/ui/buttons/CityPicker";
import AppText from "../components/ui/textStyles/AppText";
import AttractionListItem from "../components/ui/AttractionListItem";
import AttractionInfoModal from "../components/ui/Modal/AttractionInfoModal";
import { useAttractions } from "../hooks/geoapify/useAttractions";
import AttractionMap from "../components/ui/maps/AttractionMap";
import { CITY_META } from "../data/cityMeta";
import { MUST_SEE_ATTRACTIONS } from "../data/sightseeing/mustSeeAttractions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveAttraction } from "../utils/saveAttraction";
import { auth } from "../utils/firebase";

function SearchResultsScreen() {
  const [city, setCity] = useState(null);
  const { attractions, loading, error } = useAttractions(city ?? "Edinburgh");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [itineraryId, setItineraryId] = useState(null);

  const user = auth.currentUser; 


    // load selected cities and grab stored ids from async storage on mount

useEffect(() => {
  async function initScreen() {
    try {
      // 1. Grab both pieces of info from storage
      const [storedId, storedDraft] = await Promise.all([
        AsyncStorage.getItem("activeItineraryId"),
        AsyncStorage.getItem("tripDraft")
      ]);

      // 2. Set the ID state (so handleSaveAttraction knows where to save)
      if (storedId) {
        setItineraryId(storedId);
        console.log("Current Itinerary ID:", storedId);
      }

      // 3. Set the destinations and default city
      if (storedDraft) {
        const trip = JSON.parse(storedDraft);
        setDestinations(trip.destinations);

        // Default to first destination if one isn't already set
        if (trip.destinations.length > 0 && !city) {
          setCity(trip.destinations[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to initialize search results:", err);
    }
  }

  initScreen();
}, []);


  useEffect(() => {
    console.log(
      "CityPicker keys:",
      destinations.map((d) => d.id),
    );
  }, [destinations]);

  const activeCity = city ?? "Edinburgh";
  const cityMeta = CITY_META[activeCity] ?? CITY_META["Edinburgh"];

  // bring in must see attraction list
  const mustSeeForCity = useMemo(() => {
    return MUST_SEE_ATTRACTIONS[activeCity] ?? [];
  }, [activeCity]);

  const normalizedMustSee = useMemo(() => {
    return mustSeeForCity.map((item) => ({
      id: item.id,
      name: item.name,
      subtitle: "Must see",
      lat: item.lat,
      lon: item.lon,
      categories: ["must_see"],
      wikidata: item.wikidata,
      isMustSee: true,
    }));
  }, [mustSeeForCity]);

  // filter geapify to remove dupes
  const filteredGeoapifyAttractions = useMemo(() => {
    const mustSeeNames = new Set(
      normalizedMustSee.map((a) => a.name.toLowerCase()),
    );

    return attractions.filter((a) => !mustSeeNames.has(a.name.toLowerCase()));
  }, [attractions, normalizedMustSee]);

  // then merge list
  const mergedAttractions = useMemo(() => {
    return [...normalizedMustSee, ...filteredGeoapifyAttractions];
  }, [normalizedMustSee, filteredGeoapifyAttractions]);

  // set numbers for list/map refs
  const numberedAttractions = useMemo(() => {
    return mergedAttractions.map((item, index) => ({
      ...item,
      displayIndex: index + 1,
    }));
  }, [mergedAttractions]);

  // convert attractions to geojson for map
  const attractionsGeoJSON = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: numberedAttractions.map((item) => ({
        type: "Feature",
        id: item.id,
        properties: {
          name: item.name,
          subtitle: item.subtitle,
          categories: item.categories,
          index: item.displayIndex,
        },
        geometry: {
          type: "Point",
          coordinates: [item.lon, item.lat],
        },
      })),
    };
  }, [numberedAttractions]);

  const mapCenter = [cityMeta.lon, cityMeta.lat];
  const mapZoom = cityMeta.mapboxZoom;

  //   attraction open modal
  function openDetails(attraction) {
    setSelectedAttraction(attraction);
  }

  function closeDetails() {
    setSelectedAttraction(null);
  }

  // save attraction to itinerary
const handleSaveAttraction = async (attraction) => {
  
  if (!itineraryId) {
    console.error("No itineraryId found in state.");
    return;
  }

  const attractionData = {
    id: attraction.id,
    name: attraction.name,
    city: city ?? "Edinburgh",
    lat: attraction.lat,
    lon: attraction.lon,
    categories: attraction.categories ?? [],
  };

  try {
    if (user) {
      // logged in save to firebase
      await saveAttraction(user.uid, itineraryId, attractionData);
      console.log("Firebase Save successful.");
    } else {
      // guest save to async storage
      console.log(`saved "${attractionData.name} locally" as Guest...`);  
      const existingJson = await AsyncStorage.getItem("guestSavedAttractions");
      const savedList = existingJson ? JSON.parse(existingJson) : [];
      
      // check for dupes
      // TODO: CHECK IF THIS WORKS WHEN USER IS LOGGED IN (WORKS FOR LOCAL)
      if (!savedList.find(item => item.id === attraction.id)) {
        savedList.push({ ...attractionData, savedAt: Date.now() });
        await AsyncStorage.setItem("guestSavedAttractions", JSON.stringify(savedList));
      } else {

        // TODO:  change from console log to alert or toast
        console.log("Attraction already saved locally");
      }
    }

    Alert.alert("Saved", "Added to your itinerary!");
  } catch (err) {
    console.error("Save failed", err);
    Alert.alert("Error", "Could not save attraction");
  }
};

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        data={numberedAttractions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <AttractionListItem
            index={item.displayIndex}
            title={item.name}
            subtitle={item.subtitle}
            onPressInfo={() => openDetails(item)}
            onPressAdd={() => handleSaveAttraction(item)}
            onPressRow={() => {
              // TODO:  add in function that centres the map to this location when row is selected
            }}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={style.mapContainer}>
              <AttractionMap
                geojson={attractionsGeoJSON}
                center={mapCenter}
                zoom={mapZoom}
                onSelectAttraction={(feature) =>
                  openDetails({
                    id: feature.id,
                    name: feature.properties.name,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                  })
                }
              />
            </View>

            <View style={style.resultsContainer}>
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

            <AppText>{(city ?? "Edinburgh") + " Top Attractions"}</AppText>

            {loading && (
              <Text style={{ marginTop: 8 }}>Loading attractions…</Text>
            )}

            {!!error && (
              <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
            )}

            {/*spacing between header and first item */}
            <View style={{ height: 12 }} />
          </View>
        }
        // Optional: shown if no attractions
        ListEmptyComponent={<AppText>No attractions found.</AppText>}
      />

      <AttractionInfoModal
        visible={!!selectedAttraction}
        attraction={selectedAttraction}
        onClose={closeDetails}
      />
    </SafeAreaView>
  );
}
export default SearchResultsScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
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

  resultsContainer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
