import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();

	const known = Number(params.known || 0);
	const unknown = Number(params.unknown || 0);

	return (
		<View style={styles.container}>
			<Text style={styles.emoji}>🎉</Text>

			<Text style={styles.title}>Great Job!</Text>

			<View style={styles.box}>
				<Text style={styles.stat}>✅ {known} words mastered</Text>
				<Text style={styles.stat}>❌ {unknown} to review</Text>
			</View>

			<TouchableOpacity
				style={styles.btn}
				onPress={() => router.replace("/flashcard")}
			>
				<Text style={styles.btnText}>Try Again</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => router.replace("/(tabs)/stats")}>
				<Text style={styles.link}>Back to Home</Text>
			</TouchableOpacity>
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
	emoji: {
		fontSize: 60,
	},
	title: {
		fontSize: 26,
		color: "white",
		marginVertical: 20,
	},
	box: {
		backgroundColor: "#0f172a",
		padding: 20,
		borderRadius: 16,
		width: "80%",
		alignItems: "center",
		marginBottom: 30,
	},
	stat: {
		color: "white",
		fontSize: 18,
		marginVertical: 5,
	},
	btn: {
		backgroundColor: "#6366f1",
		padding: 14,
		borderRadius: 14,
		width: "70%",
		alignItems: "center",
	},
	btnText: {
		color: "white",
		fontWeight: "600",
	},
	link: {
		marginTop: 20,
		color: "#94a3b8",
	},
});
