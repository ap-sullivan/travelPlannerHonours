import { View, Image, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DestinationPicker from '../components/forms/DestinationPicker'
import SeasonPicker from '../components/forms/SeasonPicker'
import AppText from '../components/ui/textStyles/AppText'

function StartScreen() {


  return (
   <View style={style.container}>
    <SafeAreaView style={style.imageContainer}>
        <Image style={style.image} source={require('../assets/images/placeholder.jpg')}></Image>
<View style={style.destinationPickerContainer} >

        <DestinationPicker/>
        <DestinationPicker/>
</View>
    
    {/* TODO : add in ability to add more destinations dynamically*/}
        <Text style={{color: '', marginTop: 14}} >Placeholder for 'add more destinations</Text>

    <AppText>When are you planning on travelling?</AppText> 
<View style={style.seasonPickerContainer} >
        <SeasonPicker >
            Spring
        </SeasonPicker>
        <SeasonPicker >
           Summer
        </SeasonPicker>
        <SeasonPicker >
            Autumn
        </SeasonPicker>
        <SeasonPicker >
            Winter
        </SeasonPicker>
</View>

        </SafeAreaView>

   </View>
  )
}

export default StartScreen

const style = StyleSheet.create({

    container: {
        flex: 1,
    },

    imageContainer: {
    width: 'auto',
    height: 300,
    margin: 20,

},

image: {
    width: '100%',
    height: '100%',
},

 destinationPickerContainer: {
    marginTop: 26,
 },

 seasonPickerContainer: {
    marginTop: 18,
    flexDirection: 'row',
 }

})
