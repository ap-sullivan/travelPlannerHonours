import Mapbox from "@rnmapbox/maps";
import { View, StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

function AttractionMap({ geojson, onSelectAttraction, center, zoom = 7 }) {
  if (!geojson) return null;

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={{ flex: 1 }}>
        <Mapbox.Camera zoomLevel={zoom} centerCoordinate={center} />

        <Mapbox.ShapeSource
          id="attractions"
          shape={geojson}
          onPress={(e) => {
            const feature = e.features[0];
            onSelectAttraction(feature);
          }}
        >
          <Mapbox.CircleLayer id="attraction-pins" style={styles.pins} />

          <Mapbox.SymbolLayer id="pin-number" style={styles.pinNumbers} />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>
    </View>
  );
}

export default AttractionMap;

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
  pins: {
    circleRadius: 8,
    circleColor: Colors.accent500,
    circleStrokeWidth: 1,
    circleStrokeColor: Colors.gray300,
  },

  pinNumbers: {
    textField: ["get", "index"],
    textSize: 11,
    textColor: "#fff",
    textIgnorePlacement: true,
    textAllowOverlap: true,
  },
});
