import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Image } from "expo-image";
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
      <View style={style.overlay}>
        <View style={style.modalContainer}>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={style.title}>{attraction?.name}</Text>

            {loading && (
              <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
            )}

            {!loading && wiki && (
              <>
                {wiki.thumbnail && (
                  <Image
                    source={wiki.thumbnail}
                    style={style.image}
                    contentFit="cover"
                    transition={200}
                  />
                )}

                <Text style={style.extract}>{wiki.extract}</Text>

                {wiki.url && (
                  <Pressable
                    onPress={() => Linking.openURL(wiki.url)}
                    style={style.linkButton}
                  >
                    <Text style={style.linkButtonText}>
                      Read more on Wikipedia
                    </Text>
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
      </View>
    </Modal>
  );
}

export default AttractionInfoModal;

const style = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dimmed background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
  },
  image: {
    width: 250,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  extract: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 20,
  },
  linkButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  closeBtn: {
    alignSelf: "center",
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fallback: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    marginVertical: 20,
    textAlign: "center",
  },
});
