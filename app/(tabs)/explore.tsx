import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Coming soon...</Text>
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
	text: {
		color: "#94a3b8",
	},
});