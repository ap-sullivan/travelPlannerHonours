import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

function AttractionListItem({
  index,
  title,
  subtitle,
  onPressRow,
  onPressInfo,
  onPressAdd,
}) {
  return (
    <View style={style.listContainer}>
      <Pressable
        onPress={onPressRow}
        style={({ pressed }) => [style.container, pressed && style.pressed]}
      >
        <Text>{index}</Text>
        <Text>{title}</Text>
        <Text>{subtitle}</Text>
        <Text></Text>
      </Pressable>

      <View style={style.listIcons}>
        <Pressable onPress={onPressInfo} hitSlop={8}>
          <Feather name="info" size={18} color={Colors.accent600} />
        </Pressable>

        <Pressable
          onPress={() => {
            console.log("PLUS ICON PRESSED", title);
            onPressAdd && onPressAdd();
          }}
          hitSlop={8}
        >
          <Feather name="plus-circle" size={18} color={Colors.accent600} />
        </Pressable>
      </View>
    </View>
  );
}

export default AttractionListItem;

const style = StyleSheet.create({
  listContainer: {
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  

  listIcons: {
    flexDirection: "row",
    gap: 12,
  },
});
