import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StartScreen from './screens/StartScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from './constants/Colors';


export default function App() {
  return (
    <View style={styles.rootScreen}>
        <SafeAreaProvider>
          <StartScreen />
        </SafeAreaProvider>
        </View>
  );
}

const styles = StyleSheet.create({
 rootScreen : {
  flex: 1,
  backgroundColor: Colors.background
 }
});
