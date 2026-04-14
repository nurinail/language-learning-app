import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getData } from "../../src/storage";

export default function StatsScreen() {
	const [known, setKnown] = useState<number[]>([]);
	const [unknown, setUnknown] = useState<number[]>([]);
    

	useFocusEffect(
		useCallback(() => {
			const load = async () => {
				const k = await getData("knownWords");
				const u = await getData("unknownWords");

				console.log("KNOWN:", k);
				console.log("UNKNOWN:", u);

				setKnown(Array.isArray(k) ? k : []);
				setUnknown(Array.isArray(u) ? u : []);
			};

			load();
			return undefined;
		}, []),
	);

	const total = known.length + unknown.length;

	const knownPercent = total ? Math.round((known.length / total) * 100) : 0;

	const unknownPercent = total ? Math.round((unknown.length / total) * 100) : 0;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Your Progress</Text>

			<View style={styles.card}>
				<Text style={styles.big}>{total}</Text>
				<Text style={styles.label}>Total Words</Text>
			</View>

			<View style={styles.row}>
				<View style={[styles.smallCard, styles.knownCard]}>
					<Text style={styles.smallNumber}>{known.length}</Text>
					<Text style={styles.smallLabel}>Known</Text>
				</View>

				<View style={[styles.smallCard, styles.unknownCard]}>
					<Text style={styles.smallNumber}>{unknown.length}</Text>
					<Text style={styles.smallLabel}>Unknown</Text>
				</View>
			</View>

			<View style={styles.progressContainer}>
				<View style={[styles.progressKnown, { flex: knownPercent }]} />
				<View style={[styles.progressUnknown, { flex: unknownPercent }]} />
			</View>

			<Text style={styles.percentText}>
				{knownPercent}% Known • {unknownPercent}% Unknown
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#020617",
		padding: 20,
		justifyContent: "center",
	},
	title: {
		color: "#fff",
		fontSize: 26,
		fontWeight: "700",
		marginBottom: 30,
		textAlign: "center",
	},
	card: {
		backgroundColor: "#0f172a",
		padding: 30,
		borderRadius: 20,
		alignItems: "center",
		marginBottom: 20,
	},
	big: {
		color: "#fff",
		fontSize: 42,
		fontWeight: "800",
	},
	label: {
		color: "#94a3b8",
		marginTop: 5,
	},
	row: {
		flexDirection: "row",
		gap: 10,
		marginBottom: 20,
	},
	smallCard: {
		flex: 1,
		padding: 20,
		borderRadius: 16,
		alignItems: "center",
	},
	knownCard: {
		backgroundColor: "#064e3b",
	},
	unknownCard: {
		backgroundColor: "#7f1d1d",
	},
	smallNumber: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "700",
	},
	smallLabel: {
		color: "#cbd5f5",
		marginTop: 5,
	},
	progressContainer: {
		flexDirection: "row",
		height: 12,
		borderRadius: 10,
		overflow: "hidden",
		backgroundColor: "#1e293b",
		marginTop: 10,
	},
	progressKnown: {
		backgroundColor: "#10b981",
	},
	progressUnknown: {
		backgroundColor: "#ef4444",
	},
	percentText: {
		marginTop: 15,
		textAlign: "center",
		color: "#a78bfa",
		fontSize: 16,
	},
});
