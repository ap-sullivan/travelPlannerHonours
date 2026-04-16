import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Colors from "../constants/Colors";

import { SafeAreaView } from "react-native-safe-area-context";

function FinalItineraryScreen({ route }) {
  const { itinerary } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Final Itinerary</Text>

        {itinerary?.length ? (
          itinerary.map((day) => (
            <View key={day.day} style={styles.card}>
              <Text style={styles.dayTitle}>
                Day {day.day} – {day.city}
              </Text>

              <Text style={styles.plan}>{day.plan}</Text>

              <View style={styles.hotelTitle}>
                <MaterialIcons name="hotel" size={20} color="black" />
                <Text style={styles.accommodation}>{day.accommodation}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No itinerary generated</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default FinalItineraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  card: {
    backgroundColor: Colors.background,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
  },

  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  hotelTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 4,
  },

  plan: {
    fontSize: 14,
    lineHeight: 20,
  },

  accommodation: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: "italic",
  },
});
