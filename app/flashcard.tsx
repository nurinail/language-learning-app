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
import { saveData } from "../src/storage";

export default function FlashcardScreen() {
	const router = useRouter();

	const [words, setWords] = useState<any[]>([]);
	const [index, setIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);
	const [loading, setLoading] = useState(true);

	const [known, setKnown] = useState<number[]>([]);
	const [unknown, setUnknown] = useState<number[]>([]);

	const flipAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		fetchWords();
	}, []);

	const fetchWords = async () => {
		const res = await fetch(
			"https://random-word-api.herokuapp.com/word?number=10",
		);
		const data = await res.json();

		const mapped = data.map((w: string, i: number) => ({
			id: i,
			en: w,
			az: "Tap to reveal",
		}));

		setWords(mapped);
		setLoading(false);
	};

	const currentWord = words[index];

	const flipCard = () => {
		Animated.timing(flipAnim, {
			toValue: showAnswer ? 0 : 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		setShowAnswer(!showAnswer);
	};

	const next = async (newKnown: number[], newUnknown: number[]) => {
		setShowAnswer(false);
		flipAnim.setValue(0);

		if (index + 1 >= words.length) {
			// 🔥 SAVE DATA
			await saveData("knownWords", newKnown);
			await saveData("unknownWords", newUnknown);

			router.replace({
				pathname: "/result",
				params: {
					known: newKnown.length,
					unknown: newUnknown.length,
				},
			});
			return;
		}

		setIndex((prev) => prev + 1);
	};

	const handleKnow = () => {
		const updated = [...known, currentWord.id];
		setKnown(updated);
		next(updated, unknown);
	};

	const handleDontKnow = () => {
		const updated = [...unknown, currentWord.id];
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
	},
	text: {
		fontSize: 32,
		color: "white",
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
