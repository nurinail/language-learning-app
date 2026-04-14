import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getData } from "../src/storage";

export default function StatsScreen() {
	const [known, setKnown] = useState<number[]>([]);
	const [unknown, setUnknown] = useState<number[]>([]);

	const load = async () => {
		const k = await getData("knownWords");
		const u = await getData("unknownWords");

		setKnown(k || []);
		setUnknown(u || []);
	};

	useFocusEffect(
		useCallback(() => {
			load();
		}, []),
	);

	const total = known.length + unknown.length;

	const knownPercent = total ? Math.round((known.length / total) * 100) : 0;
	const unknownPercent = total ? Math.round((unknown.length / total) * 100) : 0;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Stats</Text>

			<Text style={styles.text}>Known: {known.length}</Text>
			<Text style={styles.text}>Unknown: {unknown.length}</Text>
			<Text style={styles.text}>Total: {total}</Text>

			<Text style={styles.percent}>
				{knownPercent}% Known / {unknownPercent}% Unknown
			</Text>
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
	title: {
		color: "white",
		fontSize: 24,
		marginBottom: 20,
	},
	text: {
		color: "white",
		fontSize: 18,
	},
	percent: {
		marginTop: 20,
		color: "#8b5cf6",
	},
});
