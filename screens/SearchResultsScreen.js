import React from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function SearchResultsScreen() {

  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

  const lon = -3.1883;
  const lat = 55.9533;
  const zoom = 11;

   const staticUrl =
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
    `${lon},${lat},${zoom}/600x300@2x?access_token=${token}`;

    console.log("STATIC URL:", staticUrl);


  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={style.mapContainer}>
            {/* map will go in place of image */}
            <Image
              style={style.map}
            //   source={require("../assets/images/placeholder2.jpg")}
            source={{ uri: staticUrl }}
              onError={(e) => console.log("Map image failed:", e.nativeEvent)}

            ></Image>
          </View>

          <Text>Search Results Screen</Text>
        </View>
      </ScrollView>
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
    height: 200,
    marginTop: 6,
    borderRadius: 12,
    overflow: "hidden",
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
