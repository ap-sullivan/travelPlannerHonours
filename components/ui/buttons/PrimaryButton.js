import { View, Text, Pressable, StyleSheet } from "react-native";
import Colors from '../../../constants/Colors';

function PrimaryButton({style, children, onPress}) {
    
    return (
        <View style={styles.buttonOuterContainer}>
        <Pressable style={({pressed}) => pressed ? [styles.buttonInnerContainer, styles.pressed] : styles.buttonInnerContainer}
        android_ripple={{color: Colors.primary600}}
        onPress={onPress}>
   
            <Text style={styles.buttonText}>{children}</Text>

        </Pressable>
        </View>
    )

}


export default PrimaryButton

const styles = StyleSheet.create({

    buttonOuterContainer: {
        borderRadius: 28,
        margin: 4,
        overflow: 'hidden',
    },

    buttonInnerContainer: {
        backgroundColor: Colors.primary500,
        paddingVertical: 8,
        paddingHorizontal: 16,
        elevation: 2,
    },

    buttonText : {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
    },

    pressed: {
        opacity: 0.6,
    }



});
