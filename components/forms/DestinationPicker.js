import { useState, useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import LabelText from "../ui/textStyles/LabelText";
// import { CITY_DESTINATIONS } from "../../data/cityDestinations";
import { CITY_DESTINATIONS } from "../../data/cities";

const MIN_DAYS = 1;
const MAX_DAYS = 8;

function DestinationPicker({
  label,
  name,
  onNameChange,
  days,
  onDaysChange,
  onRemove,
  canRemove,
}) {
  // for input focusing style
  // ? todo: look to make a global style so re-usable
  const [isFocused, setIsFocused] = useState(false);

  // SUGGESTED DESTINATIONS
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = useMemo(() => {
    const q = (name ?? "").trim().toLowerCase();
    if (!q) return [];
    return CITY_DESTINATIONS.filter((city) =>
      city.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [name]);

  // number picker
  const canDecrement = days > MIN_DAYS;
  const canIncrement = days < MAX_DAYS;

  const decrement = () => onDaysChange(Math.max(MIN_DAYS, days - 1));
  const increment = () => onDaysChange(Math.min(MAX_DAYS, days + 1));

  return (
    <View style={styles.row}>
      {/* Destination */}
      <View style={styles.destination}>
        <View style={styles.labelRow}>
          <LabelText style={{ marginLeft: 3, color: Colors.primary700, marginRight: 8}}>{label}</LabelText>

          {canRemove && (
            <Pressable onPress={onRemove} hitSlop={8}>
              <Feather name="x-circle" size={14} color={Colors.accent600} />
            </Pressable>
          )}
        </View>
        <View style={[styles.inputWrapper, isFocused && styles.focused]}>
          <TextInput
            keyboardType="default"
            value={name}
            onChangeText={(text) => {
              onNameChange(text);
              setShowSuggestions(true);
            }}
            placeholder="Enter destination"
            placeholderTextColor={Colors.gray500}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 100);
            }}
            style={styles.input}
            returnKeyType="search"
          />
          <Feather name="search" size={18} color={Colors.gray700} />
        </View>

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestions}>
            {suggestions.map((city) => (
              <Pressable
                key={city}
                onPress={() => {
                  onNameChange(city);
                  setShowSuggestions(false);
                }}
                style={({ pressed }) => [
                  styles.suggestionItem,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.suggestionText}>{city}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Days  */}

      <View style={styles.days}>
        <LabelText style={{ paddingLeft: 3 }}>Days</LabelText>
        <View style={[styles.stepper, isFocused && styles.focused]}>
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
            ]}
            hitSlop={8}
          >
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

  labelRow: {
    flexDirection: "row",
    marginLeft: 2,
  },

  inputWrapper: {
    position: "relative",
    zIndex: 1,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary500,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary900,
    paddingVertical: 0,
    marginRight: 8,
  },

  suggestions: {
    position: "absolute",
  left: 0,
  right: 0,
  top: 44 + 22,
  marginTop: 6,
  borderWidth: 1,
  borderColor: "#E3E8F2",
  borderRadius: 8,
  backgroundColor: "#FFF",
  overflow: "hidden",
  zIndex: 99,
  elevation: 99,
},

suggestionItem: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderTopWidth: 1,
  borderTopColor: "#E3E8F2",
},

suggestionText: {
  fontSize: 14,
  color: Colors.gray900,
},
pressed: {
    opacity: 0.6,

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
    overflow: "hidden",
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
