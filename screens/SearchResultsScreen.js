import { useState, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
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

function SearchResultsScreen() {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

  const [city, setCity] = useState(null);
  const { attractions, loading, error } = useAttractions(city ?? "Edinburgh");
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const attractionsGeoJSON = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: attractions.map((item) => ({
        type: "Feature",
        id: item.id,
        properties: {
          name: item.name,
          subtitle: item.subtitle,
          categories: item.categories,
        },
        geometry: {
          type: "Point",
          coordinates: [item.lon, item.lat],
        },
      })),
    };
  }, [attractions]);

  const activeCity = city ?? "Edinburgh";
  const cityMeta = CITY_META[activeCity];

  const mapCenter = [cityMeta.lon, cityMeta.lat];
  const mapZoom = cityMeta.mapboxZoom;

  // /hardcoded map url for testing

  // const lon = -3.1883;
  // const lat = 55.9533;
  // const zoom = 11;

  // const staticUrl =
  //   `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
  //   `${lon},${lat},${zoom}/600x300@2x?access_token=${token}`;

  // console.log("STATIC URL:", staticUrl);

  // dummy api dats

  //     const attractions = useMemo(
  //   () => [
  //     { id: "1", name: "Attraction 1" },
  //     { id: "2", name: "Attraction 2" },
  //     { id: "3", name: "Attraction 3" },
  //     { id: "4", name: "Attraction 4" },
  //     { id: "5", name: "Attraction 5" },
  //     { id: "6", name: "Attraction 6" },
  //   ],
  //   []
  // );

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
        data={attractions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <AttractionListItem
            title={item.name}
            subtitle={item.subtitle}
            onPress={() => openDetails(item)}
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
              <CityPicker
                isSelected={city === "Edinburgh"}
                onPress={() =>
                  setCity(city === "Edinburgh" ? null : "Edinburgh")
                }
              >
                Edinburgh
              </CityPicker>

              <CityPicker
                isSelected={city === "Glasgow"}
                onPress={() => setCity(city === "Glasgow" ? null : "Glasgow")}
              >
                Glasgow
              </CityPicker>

              <CityPicker
                isSelected={city === "Inverness"}
                onPress={() =>
                  setCity(city === "Inverness" ? null : "Inverness")
                }
              >
                Inverness
              </CityPicker>
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
