import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getData, setData } from "../src/storage";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;

// 🔥 timeout helper
const fetchWithTimeout = async (url: string, ms = 2000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch {
    return null;
  }
};

export default function FlashcardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const count = Number(params.count || 5);

  const [words, setWords] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  const [known, setKnown] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadWords();
  }, [count]);

  // 🚀 CACHE + API LOGIC
  const loadWords = async () => {
    try {
      setLoading(true);

      const cacheKey = `words_${count}`;

      // 🔥 CACHE CHECK
      const cached = await getData(cacheKey);

      if (cached && Array.isArray(cached)) {
        console.log("⚡ CACHE USED");
        setWords(cached);
        setLoading(false);
        return;
      }

      console.log("🌐 API CALL");

      const res = await fetch(
        `https://random-word-api.herokuapp.com/word?number=${count}`
      );
      const data = await res.json();

      const promises = data.map(async (word: string, i: number) => {
        const dictRes = await fetchWithTimeout(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
          1500
        );

        if (!dictRes) {
          return { id: i, en: word, az: "Tərif tapılmadı" };
        }

        try {
          const dictData = await dictRes.json();

          const meaning =
            dictData?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
            "Tərif tapılmadı";

          return { id: i, en: word, az: meaning };
        } catch {
          return { id: i, en: word, az: "Tərif tapılmadı" };
        }
      });

      const results = await Promise.all(promises);

      // 🔥 SAVE CACHE
      await setData(cacheKey, results);

      setWords(results);
    } catch (e) {
      console.log("❌ API ERROR:", e);

      // 🔥 OFFLINE FALLBACK
      const cached = await getData(`words_${count}`);
      if (cached) {
        console.log("📦 FALLBACK CACHE");
        setWords(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = words.length ? (index + 1) / words.length : 0;
  const current = words[index];

  const saveResults = async (k: string[], u: string[]) => {
    const ek = (await getData("knownWords")) || [];
    const eu = (await getData("unknownWords")) || [];

    await setData("knownWords", [...new Set([...ek, ...k])]);
    await setData("unknownWords", [...new Set([...eu, ...u])]);
  };

  const next = async (k: string[], u: string[]) => {
    if (index + 1 >= words.length) {
      await saveResults(k, u);
      router.replace("/(tabs)/stats");
      return;
    }

    setIndex((p) => p + 1);
    setShowAnswer(false);
    position.setValue({ x: 0, y: 0 });
  };

  const swipe = async (dir: "left" | "right") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (dir === "right") {
      const updated = [...known, current.en];
      setKnown(updated);
      next(updated, unknown);
    } else {
      const updated = [...unknown, current.en];
      setUnknown(updated);
      next(known, updated);
    }
  };

  const handleKnow = () => {
    Animated.timing(position, {
      toValue: { x: width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => swipe("right"));
  };

  const handleDontKnow = () => {
    Animated.timing(position, {
      toValue: { x: -width, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(() => swipe("left"));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) handleKnow();
        else if (g.dx < -SWIPE_THRESHOLD) handleDontKnow();
        else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="white" size="large" />
        <Text style={{ color: "#94a3b8", marginTop: 10 }}>
          Yüklənir...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#020617", "#020617"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Session</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>

        <Text style={styles.counter}>
          {index + 1} / {words.length}
        </Text>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
            ],
          },
        ]}
      >
        <Text style={styles.word}>
          {showAnswer ? current.az : current.en}
        </Text>

        <Text style={styles.tap} onPress={() => setShowAnswer(!showAnswer)}>
          toxun
        </Text>
      </Animated.View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.bad} onPress={handleDontKnow}>
          <Text style={styles.btn}>❌</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.good} onPress={handleKnow}>
          <Text style={styles.btn}>✅</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 80,
    width: "90%",
  },
  title: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: "row",
    height: 8,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#8b5cf6",
  },
  counter: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    width: 320,
    height: 220,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  word: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },
  tap: {
    marginTop: 10,
    color: "#8b5cf6",
  },
  actions: {
    flexDirection: "row",
    marginTop: 40,
    gap: 20,
  },
  good: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
  },
  bad: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
  },
  btn: {
    color: "white",
    fontSize: 18,
  },
});