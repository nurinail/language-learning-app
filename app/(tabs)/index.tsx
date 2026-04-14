import { getData } from "@/src/storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
	const router = useRouter();

	// 🔥 FLOAT ICON
	const floatAnim = useRef(new Animated.Value(0)).current;

	// 🔥 ENTRY ANIMATION
	const translateY = useRef(new Animated.Value(80)).current;
	const opacity = useRef(new Animated.Value(0)).current;

	// 🔥 STREAK PULSE
	const pulse = useRef(new Animated.Value(1)).current;

	const [total, setTotal] = useState(0);

	const streak = 3;

	useEffect(() => {
		// FLOAT
		Animated.loop(
			Animated.sequence([
				Animated.timing(floatAnim, {
					toValue: -10,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(floatAnim, {
					toValue: 0,
					duration: 1500,
					useNativeDriver: true,
				}),
			]),
		).start();

		// ENTRY
		Animated.parallel([
			Animated.timing(translateY, {
				toValue: 0,
				duration: 700,
				useNativeDriver: true,
			}),
			Animated.timing(opacity, {
				toValue: 1,
				duration: 700,
				useNativeDriver: true,
			}),
		]).start();

		// PULSE
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulse, {
					toValue: 1.1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(pulse, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, [floatAnim, translateY, opacity, pulse]);

	// 🔥 LOAD STATS
	useEffect(() => {
		const loadStats = async () => {
			const known = (await getData("knownWords")) || [];
			const unknown = (await getData("unknownWords")) || [];
			setTotal(known.length + unknown.length);
		};
		loadStats();
	}, []);

	// 🔥 START
	const start = async (count: number) => {
		await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		router.push({
			pathname: "/flashcard",
			params: { count },
		});
	};

	// 🔥 BUTTON COMPONENT
	const RenderButton = ({ label, count }: any) => {
		const scale = useRef(new Animated.Value(1)).current;
		const [pressed, setPressed] = useState(false);

		const pressIn = () => {
			setPressed(true);
			Animated.spring(scale, {
				toValue: 0.9,
				useNativeDriver: true,
			}).start();
		};

		const pressOut = () => {
			setPressed(false);
			Animated.spring(scale, {
				toValue: 1,
				useNativeDriver: true,
			}).start();
		};

		return (
			<TouchableOpacity
				onPress={() => start(count)}
				onPressIn={pressIn}
				onPressOut={pressOut}
				activeOpacity={1}
			>
				<Animated.View style={[styles.option, { transform: [{ scale }] }]}>
					<LinearGradient
						colors={pressed ? ["#8b5cf6", "#6366f1"] : ["#6366f1", "#8b5cf6"]}
						style={styles.optionInner}
					>
						<Text style={styles.optionText}>{label}</Text>
					</LinearGradient>
				</Animated.View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{/* 🔥 BACKGROUND */}
			<LinearGradient
				colors={["#1e1b4b", "#020617", "#020617"]}
				style={StyleSheet.absoluteFill}
			/>

			{/* 🔥 GLOW */}
			<LinearGradient
				colors={["rgba(99,102,241,0.4)", "transparent"]}
				style={styles.glow}
			/>

			{/* 🔥 NOISE */}
			<View style={styles.noise} />

			<Animated.View
				style={[styles.content, { transform: [{ translateY }], opacity }]}
			>
				{/* ICON */}
				<Animated.Text
					style={[styles.logo, { transform: [{ translateY: floatAnim }] }]}
				>
					📚
				</Animated.Text>

				<Text style={styles.title}>Learn English</Text>

				<Text style={styles.subtitle}>
					How many words do you want to master today?
				</Text>

				{/* 🔥 STATS */}
				<View style={styles.stats}>
					<Animated.Text
						style={[styles.stat, { transform: [{ scale: pulse }] }]}
					>
						🔥 {streak} day streak
					</Animated.Text>

					<Text style={styles.stat}>📊 {total} words learned</Text>
				</View>

				{/* 🔥 BUTTONS */}
				<View style={styles.row}>
					<RenderButton label="Quick ⚡" count={5} />
					<RenderButton label="Balanced 🎯" count={10} />
					<RenderButton label="Intense 🔥" count={20} />
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	glow: {
		position: "absolute",
		top: -100,
		left: -100,
		width: 300,
		height: 300,
		borderRadius: 200,
	},
	noise: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(255,255,255,0.02)",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	logo: {
		fontSize: 70,
		marginBottom: 20,
		textShadowColor: "#8b5cf6",
		textShadowRadius: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: "800",
		color: "white",
	},
	subtitle: {
		color: "#94a3b8",
		marginTop: 10,
		marginBottom: 20,
		textAlign: "center",
	},
	stats: {
		flexDirection: "row",
		gap: 20,
		marginBottom: 30,
	},
	stat: {
		color: "#cbd5f5",
		fontSize: 14,
	},
	row: {
		flexDirection: "row",
		gap: 12,
	},
	option: {
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#6366f1",
		shadowOpacity: 0.5,
		shadowRadius: 15,
		elevation: 10,
	},
	optionInner: {
		paddingVertical: 16,
		paddingHorizontal: 18,
		alignItems: "center",
	},
	optionText: {
		color: "white",
		fontSize: 14,
		fontWeight: "700",
	},
});
