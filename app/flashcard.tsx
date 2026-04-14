import * as Haptics from "expo-haptics";
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

	// 🔥 FETCH
	useEffect(() => {
		const load = async () => {
			const res = await fetch(
				`https://random-word-api.herokuapp.com/word?number=${count}`,
			);
			const data = await res.json();

			const results = data.map((w: string, i: number) => ({
				id: i,
				en: w,
				az: "Tap to reveal",
			}));

			setWords(results);
			setLoading(false);
		};

		load();
	}, [ count ]);

	const current = words[index];

	// 🔥 SAVE
	const saveResults = async (newKnown: string[], newUnknown: string[]) => {
	const existingKnown = (await getData("knownWords")) || [];
	const existingUnknown = (await getData("unknownWords")) || [];

	// normalize
	const existK = Array.isArray(existingKnown) ? existingKnown : [];
	const existU = Array.isArray(existingUnknown) ? existingUnknown : [];

	// 🔥 MERGE + UNIQUE
	const mergedKnown = Array.from(new Set([...existK, ...newKnown]));
	const mergedUnknown = Array.from(new Set([...existU, ...newUnknown]));

	await setData("knownWords", mergedKnown);
	await setData("unknownWords", mergedUnknown);
};

	const goNext = async (k: string[], u: string[]) => {
		if (index + 1 >= words.length) {
			await saveResults(k, u);
			router.replace("/(tabs)/stats");
			return;
		}
		setIndex((p) => p + 1);
		setShowAnswer(false);
		position.setValue({ x: 0, y: 0 });
	};

	const handleSwipe = async (dir: "left" | "right") => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		if (dir === "right") {
			const updated = [...known, current.en];
			setKnown(updated);
			goNext(updated, unknown);
		} else {
			const updated = [...unknown, current.en];
			setUnknown(updated);
			goNext(known, updated);
		}
	};

	// 🔥 BUTTON CLICK HANDLERS
	const handleKnowClick = () => {
		Animated.timing(position, {
			toValue: { x: width, y: 0 },
			duration: 200,
			useNativeDriver: true,
		}).start(() => handleSwipe("right"));
	};

	const handleDontKnowClick = () => {
		Animated.timing(position, {
			toValue: { x: -width, y: 0 },
			duration: 200,
			useNativeDriver: true,
		}).start(() => handleSwipe("left"));
	};

	// 🔥 SWIPE
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,

			onPanResponderMove: (_, g) => {
				position.setValue({ x: g.dx, y: g.dy });
			},

			onPanResponderRelease: (_, g) => {
				if (g.dx > SWIPE_THRESHOLD) {
					handleKnowClick();
				} else if (g.dx < -SWIPE_THRESHOLD) {
					handleDontKnowClick();
				} else {
					Animated.spring(position, {
						toValue: { x: 0, y: 0 },
						useNativeDriver: true,
					}).start();
				}
			},
		}),
	).current;

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator color="white" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.hint}>← Review | Know →</Text>

			<Animated.View
				{...panResponder.panHandlers}
				style={[
					styles.card,
					{
						transform: [{ translateX: position.x }, { translateY: position.y }],
					},
				]}
			>
				<Text style={styles.word}>{showAnswer ? current.az : current.en}</Text>

				<Text style={styles.tap} onPress={() => setShowAnswer(!showAnswer)}>
					Tap to reveal
				</Text>
			</Animated.View>

			{/* 🔥 BUTTONLAR */}
			<View style={styles.actions}>
				<TouchableOpacity style={styles.badBtn} onPress={handleDontKnowClick}>
					<Text style={styles.btnText}>❌</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.goodBtn} onPress={handleKnowClick}>
					<Text style={styles.btnText}>✅</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#020617",
		justifyContent: "center",
		alignItems: "center",
	},
	hint: {
		position: "absolute",
		top: 100,
		color: "#64748b",
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
	goodBtn: {
		backgroundColor: "#22c55e",
		padding: 16,
		borderRadius: 12,
	},
	badBtn: {
		backgroundColor: "#ef4444",
		padding: 16,
		borderRadius: 12,
	},
	btnText: {
		color: "white",
		fontSize: 18,
	},
});
