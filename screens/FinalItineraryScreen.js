import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function FinalItineraryScreen({ route }) {
  const { itinerary } = route.params; 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your AI Itinerary</Text>

        <Text style={styles.text}>
          {itinerary || "No itinerary generated."}
        </Text>
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
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});