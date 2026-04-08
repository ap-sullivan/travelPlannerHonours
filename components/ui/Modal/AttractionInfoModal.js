import { useEffect, useState } from "react";
import Colors from "../../../constants/Colors";
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
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { fetchWikiSmart } from "../../../utils/wiki";
import { functions } from "../../../utils/firebase";
import { httpsCallable } from "firebase/functions";
import { auth } from "../../../utils/firebase";

function AttractionInfoModal({ visible, attraction, onClose }) {
  const [wiki, setWiki] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI State
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Wiki data fetching
  useEffect(() => {
    if (!visible || !attraction?.lat || !attraction?.lon) return;

    let isMounted = true;
    setLoading(true);
    setWiki(null);
    setAiInsight(""); // Reset AI response when modal opens for a new attraction

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

  // AI Function Call
  const handleAiInsight = async () => {
    if (!auth.currentUser) {
      console.log("User not signed in");
      alert("Please sign in to use AI");
      return;
    }

    setAiLoading(true);
    try {
      const getInsights = httpsCallable(functions, "getAttractionInsights");
      const result = await getInsights({
        city: attraction?.city || "Scotland",
        attractionName: attraction?.name,
      });

      if (result.data.success) {
        setAiInsight(result.data.insight);
      }
    } catch (error) {
      console.error("AI Insight Error:", error);
      alert("Failed to fetch AI insights. Make sure you are logged in.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={style.overlay}>
        <View style={style.modalContainer}>
          <View style={style.header}>
            <Text style={style.title}>{attraction?.name}</Text>
            <Pressable onPress={onClose} style={style.closeXBtn}>
              <Feather name="x-circle" size={18} color="black" />
            </Pressable>
          </View>

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
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
              <View style={{ alignItems: "center" }}>
                <Text style={style.fallback}>
                  No Wikipedia information found.
                </Text>
                <Text
                  style={[style.fallback, { marginBottom: 10, marginTop: 0 }]}
                >
                  Use AI to find out more about this attraction.
                </Text>
              </View>
            )}

            {/* AI Action Button - Only show if AI hasn't loaded yet */}
            {!aiInsight && !aiLoading && (
              <Pressable
                onPress={handleAiInsight}
                style={({ pressed }) => [
                  style.linkButton,
                  {
                    backgroundColor: pressed
                      ? Colors.primary700
                      : Colors.primary600,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Feather
                  name="zap"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={style.linkButtonText}>Generate AI Insights</Text>
              </Pressable>
            )}

            {/* AI Response Area */}
            {(aiLoading || aiInsight) && (
              <View style={style.aiContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Feather name="zap" size={14} color="#FFD700" />
                  <Text
                    style={{ fontWeight: "700", marginLeft: 5, color: "#444" }}
                  >
                    AI Insights
                  </Text>
                </View>

                {aiLoading ? (
                  <ActivityIndicator size="small" color="#1E90FF" />
                ) : (
                  <Text style={style.extract}>{aiInsight}</Text>
                )}
              </View>
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

const style = StyleSheet.create({
  // ... your existing styles ...
  aiContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 16,
  },
  closeXBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
    maxWidth: "80%",
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
    marginVertical: 10,
    textAlign: "center",
  },
});

export default AttractionInfoModal;
