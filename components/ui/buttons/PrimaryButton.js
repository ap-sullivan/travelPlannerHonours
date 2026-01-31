import { View, Text, Pressable, StyleSheet } from "react-native";
import Colors from "../../../constants/Colors";

function PrimaryButton({ style, children, onPress, disabled }) {
  return (
    <View style={[styles.buttonOuterContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
        android_ripple={{ color: Colors.primary600 }}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    marginVertical: 6,
    overflow: "hidden",
  },

  buttonInnerContainer: {
    backgroundColor: Colors.primary700,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
  },

  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  disabled: {
    opacity: 0.4,
  },
});
