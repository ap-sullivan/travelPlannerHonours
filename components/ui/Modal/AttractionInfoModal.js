import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

function AttractionInfoModal({ visible, attraction, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={style.modalContainer}> 
        <Text style={style.title}>{attraction?.name}</Text>
        <Pressable onPress={onClose} style={style.closeBtn}>
          <Text>Close</Text>
        </Pressable>

      </View>
    </Modal>
  );
}

export default AttractionInfoModal;

const style = StyleSheet.create({

    modalContainer: {
    flex: 1,
    backgroundColor: "green",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 160,
    opacity: 0.95,
  },

  closeBtn: {
    marginTop: 24,
  },

    title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
    });