// component for displaying an attraction in the search results flatlist

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
        <View style={style.rowContent}>
          <View style={style.indexContainer}>
            <Text style={style.index}>{index}</Text>
          </View>

          <View style={style.textContainer}>
            <Text style={style.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={style.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </Pressable>

      <View style={style.listIcons}>
        <Pressable onPress={onPressInfo} hitSlop={8}>
          <Feather name="info" size={18} color={Colors.accent600} />
        </Pressable>

        <Pressable
          onPress={() => {
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
    height: 48,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray200,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  rowContent: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    paddingRight: 14,
    fontSize: 15,
    color: "#000",
  },

  subtitle: {
    fontWeight: "600",
    color: Colors.gray700,
  },

  indexContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent700,
    alignItems: "center",
    justifyContent: "center",
  },

  index: {
    fontSize: 12,
    fontWeight: "600",
  },

  listIcons: {
    flexDirection: "row",
    gap: 10,
  },
});
