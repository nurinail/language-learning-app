import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
	const router = useRouter();

	return (
		<LinearGradient
			colors={["#d0691fff", "#020617", "#22438eff"]}
			style={styles.container}
		>
			<View style={styles.content}>
				<Text style={styles.logo}>📚</Text>

				<Text style={styles.title}>Learn English</Text>
				<Text style={styles.subtitle}>Master words with smart repetition</Text>

				<TouchableOpacity
					style={styles.primaryButton}
					onPress={() => router.push("/flashcard")}
				>
					<LinearGradient
						colors={["#6366f1", "#8b5cf6"]}
						style={styles.gradientBtn}
					>
						<Text style={styles.primaryText}>Start Learning</Text>
					</LinearGradient>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.push("/(tabs)/stats")}>
					<Text style={styles.linkText}>View Progress</Text>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: { fontSize: 60, marginBottom: 20 },
	title: {
		fontSize: 30,
		fontWeight: "700",
		color: "white",
	},
	subtitle: {
		color: "#64748b",
		marginTop: 6,
		marginBottom: 40,
	},
	primaryButton: {
		width: "80%",
		borderRadius: 14,
		overflow: "hidden",
		marginBottom: 20,
	},
	gradientBtn: {
		paddingVertical: 16,
		alignItems: "center",
	},
	primaryText: {
		color: "white",
		fontWeight: "600",
		fontSize: 16,
	},
	linkText: {
		color: "#94a3b8",
	},
});