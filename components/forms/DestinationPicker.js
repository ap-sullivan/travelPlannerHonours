import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function DestinationPicker({}) {


  return (
    <View style={styles.row}>
      {/* Destination */}
      <View style={styles.destination}>
        <Text style={styles.label}>Destination 1/2/3 etc...</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            // value={destination}
            // onChangeText={onDestinationChange}
            placeholder="Enter destination"
            placeholderTextColor="#9AA3B2"
            style={styles.input}
            returnKeyType="search"
          />
          <Feather name="search" size={18} color="#5B667A" />
        </View>
      </View>

      {/* Days */}
      <View style={styles.days}>
        <Text style={styles.label}>Days</Text>
        <View style={styles.stepper}>
          <Pressable style={styles.stepButton} hitSlop={8}>
            <Feather name="minus" size={16} color="#2F3A4D" />
          </Pressable>

          <View style={styles.valueBox}>
            <Text style={styles.value}>1</Text>
          </View>

          <Pressable style={styles.stepButton} hitSlop={8}>
            <Feather name="plus" size={16} color="#2F3A4D" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default DestinationPicker;


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 12,
    color: "#5B667A",
    marginBottom: 6,
     paddingLeft: 3,
  },
  destination: {
    flex: 1,
    marginVertical: 6,
   
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#C9D1E0",
    borderRadius: 8,
    backgroundColor: "#FFF"
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2A3A",
    paddingVertical: 0,
    marginRight: 8,
  },
  days: {
    width: 110,
    marginVertical: 6,
  },
  stepper: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C9D1E0",
    borderRadius: 8,
    backgroundColor: "#FFF",
    overflow: "hidden"
  },
  stepButton: {
    width: 36,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  valueBox: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E3E8F2",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2A3A",
  },
});
