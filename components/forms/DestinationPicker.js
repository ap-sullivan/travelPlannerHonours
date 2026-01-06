import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import LabelText from "../ui/textStyles/LabelText";

const MIN_DAYS = 1;
const MAX_DAYS = 8;

function DestinationPicker({days, onDaysChange}) {

  // for input focusing style
  // ? todo: look to make a global style so re-usable
  const [isFocused, setIsFocused] = useState(false);

  // number picker 
  const canDecrement = days > MIN_DAYS;
  const canIncrement = days < MAX_DAYS;

   const decrement = () => onDaysChange(Math.max(MIN_DAYS, days - 1));
  const increment = () => onDaysChange(Math.min(MAX_DAYS, days + 1));
  



  return (
    <View style={styles.row}>
      {/* Destination */}
      <View style={styles.destination}>
        <LabelText style={{ paddingLeft: 3 }}>Destination 1/2/3 etc...</LabelText>
        <View style={[styles.inputWrapper,
        isFocused && styles.focused,]}>
          <TextInput
          keyboardType="default"
            // value={destination}
            // onChangeText={onDestinationChange}
            placeholder="Enter destination"
            placeholderTextColor={Colors.gray500}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.input}
            returnKeyType="search"
          />
          <Feather name="search" size={18} color={Colors.gray700} />
        </View>
      </View>

      {/* Days */}
      <View style={styles.days}>
        <LabelText style={{ paddingLeft: 3 }}>Days</LabelText>
        <View style={[styles.stepper,
        isFocused && styles.focused,]}>
          <Pressable
            onPress={decrement}
            disabled={!canDecrement}
            style={({ pressed }) => [
              styles.stepButton,
              pressed && canDecrement && styles.pressed,
              !canDecrement && styles.disabledButton,
            ]}
            hitSlop={8}
          >
            <Feather
            name="minus"
            size={16}
            color={canDecrement ? Colors.primary800 : Colors.gray400}
 />
          </Pressable>

          <View style={styles.valueBox}>
            <Text style={styles.value}>{days}</Text>
          </View>

          <Pressable
          onPress={increment}
            disabled={!canIncrement}
            style={({ pressed }) => [
              styles.stepButton,
              pressed && canIncrement && styles.pressed,
              !canIncrement && styles.disabledButton,
            ]} hitSlop={8}>
            <Feather
            name="plus"
            size={16}
            color={canIncrement ? Colors.primary800 : Colors.gray400}

            />
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
    borderColor: Colors.primary500,
    borderRadius: 8,
    backgroundColor: "#FFF"
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary900,
    paddingVertical: 0,
    marginRight: 8,
  },

   focused: {
    borderColor: Colors.accent500,
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
    borderColor: Colors.primary500,
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

  disabledButton: {
    opacity: 0.4,
  },
});
