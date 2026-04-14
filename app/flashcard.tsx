import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getData, setData } from "../src/storage";

export default function FlashcardScreen() {
	const router = useRouter();

	const [words, setWords] = useState<{ id: number; en: string; az: string }[]>([]);
	const [index, setIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [loading, setLoading] = useState(true);

	// store words (strings) instead of numeric indexes so items are unique across sessions
	const [known, setKnown] = useState<string[]>([]);
	const [unknown, setUnknown] = useState<string[]>([]);

	const flipAnim = useRef(new Animated.Value(0)).current;


	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch(
					"https://random-word-api.herokuapp.com/word?number=5"
				);
				const data = await res.json();

				const results = [];

				for (let i = 0; i < data.length; i++) {
					const word = data[i];

					try {
						const dictRes = await fetch(
							`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
						);
						const dictData = await dictRes.json();

						const meaning =
							dictData?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
							"No definition";

						results.push({
							id: i,
							en: word,
							az: meaning,
						});
					} catch {
						results.push({
							id: i,
							en: word,
							az: "No definition",
						});
					}
				}

				setWords(results);
				setLoading(false);
			} catch (e) {
				console.log("API ERROR", e);
			}
		};

		load();
	}, []);

	const currentWord = words[index];

	const flipCard = () => {
		Animated.timing(flipAnim, {
			toValue: showAnswer ? 0 : 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		setShowAnswer(!showAnswer);
	};

	const saveResults = async (newKnown: string[], newUnknown: string[]) => {
		const existingKnown = (await getData("knownWords")) || [];
		const existingUnknown = (await getData("unknownWords")) || [];

		// normalize incoming and existing values to string arrays
		const existKnownArr = Array.isArray(existingKnown) ? existingKnown : [];
		const existUnknownArr = Array.isArray(existingUnknown) ? existingUnknown : [];

		const mergedKnown = Array.from(
			new Set([...existKnownArr, ...newKnown])
		);
		const mergedUnknown = Array.from(
			new Set([...existUnknownArr, ...newUnknown])
		);

		await setData("knownWords", mergedKnown);
		await setData("unknownWords", mergedUnknown);
	};

	const next = async (newKnown: string[], newUnknown: string[]) => {
		setShowAnswer(false);
		flipAnim.setValue(0);

		if (index + 1 >= words.length) {
			await saveResults(newKnown, newUnknown);

			router.replace("/(tabs)/stats");
			return;
		}

		setIndex((prev) => prev + 1);
	};

	const handleKnow = () => {
		const updated = [...known, currentWord.en];
		setKnown(updated);
		next(updated, unknown);
	};

	const handleDontKnow = () => {
		const updated = [...unknown, currentWord.en];
		setUnknown(updated);
		next(known, updated);
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator color="white" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={flipCard}>
				<Animated.View style={styles.card}>
					<Text style={styles.text}>
						{showAnswer ? currentWord.az : currentWord.en}
					</Text>
				</Animated.View>
			</TouchableOpacity>

			<View style={styles.actions}>
				<TouchableOpacity style={styles.badBtn} onPress={handleDontKnow}>
					<Text style={styles.btnText}>❌</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.goodBtn} onPress={handleKnow}>
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
	card: {
		width: 320,
		height: 200,
		backgroundColor: "#0f172a",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	text: {
		fontSize: 20,
		color: "white",
		textAlign: "center",
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