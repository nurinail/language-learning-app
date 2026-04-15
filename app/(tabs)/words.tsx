import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getData } from "../../src/storage";

export default function WordsScreen() {
  const [known, setKnown] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"known" | "unknown">("unknown");

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const k = await getData("knownWords");
        const u = await getData("unknownWords");

        setKnown(Array.isArray(k) ? k : []);
        setUnknown(Array.isArray(u) ? u : []);
      };

      load();
    }, [])
  );

  const data = activeTab === "known" ? known : unknown;

  return (
    <LinearGradient colors={["#020617", "#020617"]} style={styles.container}>
      <Text style={styles.title}>Sözlərim</Text>

      {/* 🔥 TAB SWITCH */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "unknown" && styles.activeTab]}
          onPress={() => setActiveTab("unknown")}
        >
          <Text style={styles.tabText}>❌ Bilmədiklərim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "known" && styles.activeTab]}
          onPress={() => setActiveTab("known")}
        >
          <Text style={styles.tabText}>✅ Bildiklərim</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 LIST */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedWord(item)}
          >
            <Text style={styles.word}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 🔥 MODAL (DETAIL VIEW) */}
      <Modal visible={!!selectedWord} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalWord}>{selectedWord}</Text>

            <Text style={styles.modalDesc}>
              {activeTab === "known"
                ? "Sən artıq bu sözü bilirsən 💪"
                : "Bu sözü təkrar etməlisən 📚"}
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedWord(null)}
            >
              <Text style={styles.closeText}>Bağla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },

  tab: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#8b5cf6",
  },

  tabText: {
    color: "white",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#0f172a",
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  word: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "80%",
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },

  modalWord: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },

  modalDesc: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },

  closeBtn: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  closeText: {
    color: "white",
    fontWeight: "600",
  },
});