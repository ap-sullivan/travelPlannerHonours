import Mapbox from '@rnmapbox/maps';
import { View, StyleSheet } from 'react-native';
import Colors from '../../../constants/Colors';

function AttractionMap({
  geojson,
  onSelectAttraction,
  center,
  zoom = 11,
}) {
  if (!geojson) return null;

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={StyleSheet.absoluteFill}>
        <Mapbox.Camera
          zoomLevel={zoom}
          centerCoordinate={center}
        />

        <Mapbox.ShapeSource
          id="attractions"
          shape={geojson}
          onPress={(e) => {
            const feature = e.features[0];
            onSelectAttraction(feature);
          }}
        >
          <Mapbox.CircleLayer
            id="attraction-pins"
            style={styles.pins}
          />
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
    overflow: 'hidden',
  },
  pins: {
    circleRadius: 6,
    circleColor: Colors.accent600   ,
    circleStrokeWidth: 1,
    circleStrokeColor: '#fff',
  },
});
