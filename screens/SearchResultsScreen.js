import { useState, useMemo, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
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

function SearchResultsScreen() {
  const [city, setCity] = useState(null);
  const { attractions, loading, error } = useAttractions(city ?? "Edinburgh");
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
  console.log(
    "CityPicker keys:",
    destinations.map(d => d.id)
  );
}, [destinations]);

  // load selected city from async storage on mount

  useEffect(() => {
    async function loadDestinations() {
      try {
        const stored = await AsyncStorage.getItem("tripDraft");
        if (!stored) return;

        const trip = JSON.parse(stored);

        setDestinations(trip.destinations);

        // default to first destination
        if (trip.destinations.length > 0) {
          setCity(trip.destinations[0].name);
        }
      } catch (err) {
        console.error("Failed to load trip", err);
      }
    }

    loadDestinations();
  }, []);

 

  const activeCity = city ?? "Edinburgh";
  const cityMeta = CITY_META[activeCity] ?? CITY_META["Edinburgh"];

  // bring in must see atttraction list 
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
    normalizedMustSee.map((a) => a.name.toLowerCase())
  );

  return attractions.filter(
    (a) => !mustSeeNames.has(a.name.toLowerCase())
  );
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
            // debugCategories={item.debugCategories}
            subtitle={item.subtitle}
            onPressInfo={() => openDetails(item)}
            onPressRow={() => {
              // TODO:  add in function that centres the map to this location when row is selected
            }}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={style.mapContainer}>
              {/* <Image style={style.map} source={{ uri: staticUrl }} /> */}

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
