import { View, Text, StyleSheet, Pressable } from "react-native"
import Colors from "../../constants/Colors"
import { FontSize } from "../../constants/Typography";


function SeasonPicker({children, onPress, isSelected}) {
  return (
      <View style={styles.buttonOuterContainer}>
        <Pressable
        onPress={onPress}
        android_ripple={{color: Colors.primary600}}
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          isSelected && styles.selected,
          pressed && styles.pressed,
        ]}>
                    <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
                {children}</Text>

        </Pressable>
        </View>
  )

}

export default SeasonPicker

const styles = StyleSheet.create({

    buttonOuterContainer: {
        flex: 1,
        borderRadius: 14,
        margin: 4,
        overflow: 'hidden',
    },

    buttonInnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.gray400,
        paddingVertical: 12,
        paddingHorizontal: 8,
        elevation: 2,
        // IOS shadow
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

      selected: {
    backgroundColor: Colors.primary500,
  },

    buttonText : {
        color: Colors.primary900,
        fontFamily: 'Inter_600SemiBold',
        fontSize: FontSize.body,
        textAlign: 'center',
    },

      selectedText: {
        color: Colors.white,

  },

    pressed: {
        opacity: 0.6,
    }


});