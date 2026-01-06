import { useState } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
  Text,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DestinationPicker from "../components/forms/DestinationPicker";
import SeasonPicker from "../components/forms/SeasonPicker";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import AppText from "../components/ui/textStyles/AppText";
import { Feather } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const MIN_DAYS = 1;
const MAX_DAYS = 8;
const MAX_DESTINATIONS = 4;

function StartScreen() {
  const [season, setSeason] = useState(null);
  const [destinations, setDestinations] = useState([
    { id: "1", name: "", days: 1 },
    { id: "2", name: "", days: 1 },
  ]);

const addDestination = () => {
  setDestinations((prev) => {
    if (prev.length >= MAX_DESTINATIONS) {
      return prev;
    }

    return [
      ...prev,
      {
        id: String(Date.now()),
        name: "",
        days: MIN_DAYS,
      },
    ];
  });
};

  return (
    <SafeAreaView style={style.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <View style={style.imageContainer}>
            <Image
              style={style.image}
              source={require("../assets/images/placeholder.jpg")}
            ></Image>
          </View>
          <View style={style.destinationPickerContainer}>
            {destinations.map((d) => (
              <DestinationPicker
                key={d.id}
                days={d.days}
                onDaysChange={(nextDays) =>
                  setDestinations((prev) =>
                    prev.map((x) =>
                      x.id === d.id ? { ...x, days: nextDays } : x
                    )
                  )
                }
              />
            ))}
          </View>

          <Pressable onPress={addDestination} style={{ marginTop: 12 }}>
            <Text style={{ color: "blue" }}>
               <Feather
            name="plus-circle"
            size={16}
            color={Colors.gray400}
 />
              Add another destination</Text>
          </Pressable>

          {/* TODO : add in ability to add more destinations dynamically*/}
          <Text>Placeholder for 'add more destinations</Text>

          <AppText>When are you planning on travelling?</AppText>
          <View style={style.seasonPickerContainer}>
            <SeasonPicker
              isSelected={season === "Spring"}
              onPress={() => setSeason(season === "Spring" ? null : "Spring")}
            >
              Spring
            </SeasonPicker>
            <SeasonPicker
              isSelected={season === "Summer"}
              onPress={() => setSeason(season === "Summer" ? null : "Summer")}
            >
              Summer
            </SeasonPicker>
            <SeasonPicker
              isSelected={season === "Autumn"}
              onPress={() => setSeason(season === "Autumn" ? null : "Autumn")}
            >
              Autumn
            </SeasonPicker>
            <SeasonPicker
              isSelected={season === "Winter"}
              onPress={() => setSeason(season === "Winter" ? null : "Winter")}
            >
              Winter
            </SeasonPicker>
          </View>

          <View style={style.startButtonContainer}>
            <PrimaryButton>START PLANNING</PrimaryButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default StartScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },

  imageContainer: {
    width: "auto",
    height: 200,
    marginTop: 6,
    // marginHorizontal: 20,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  destinationPickerContainer: {
    marginTop: 26,
  },

  seasonPickerContainer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  startButtonContainer: {
    marginTop: 32,
  },
});
