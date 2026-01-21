import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { fetchWikiSmart } from "../../../utils/wiki";

function AttractionInfoModal({ visible, attraction, onClose }) {

  const [wiki, setWiki] = useState(null);
const [loading, setLoading] = useState(false);


useEffect(() => {
  if (!visible || !attraction?.lat || !attraction?.lon) return;

  let isMounted = true;
  setLoading(true);
  setWiki(null);

  fetchWikiSmart(attraction).then((data) => {
    if (isMounted) {
      setWiki(data);
      setLoading(false);
    }
  });

  return () => {
    isMounted = false;
  };
}, [visible, attraction]);



  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={style.modalContainer}> 
        {/* <Text style={style.title}>{attraction?.name}</Text>
        <Pressable onPress={onClose} style={style.closeBtn}>
          <Text>Close</Text>
        </Pressable> */}

         <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={style.title}>{attraction?.name}</Text>

            {loading && (
              <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
            )}

            {!loading && wiki && (
              <>
                {wiki.thumbnail && (
                  <Image
                    source={{ uri: wiki.thumbnail }}
                    style={style.image}
                  />
                )}

                <Text style={style.wikiTitle}>{wiki.title}</Text>

                <Text style={style.extract}>{wiki.extract}</Text>

                {wiki.url && (
                  <Pressable onPress={() => Linking.openURL(wiki.url)}>
                    <Text style={style.link}>Read more on Wikipedia</Text>
                  </Pressable>
                )}
              </>
            )}

            {!loading && !wiki && (
              <Text style={style.fallback}>
                No Wikipedia information found for this location.
              </Text>
            )}

            <Pressable onPress={onClose} style={style.closeBtn}>
              <Text style={style.closeText}>Close</Text>
            </Pressable>
          </ScrollView>

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

  image: {
    height: 150,
    width: 150
  }
    });