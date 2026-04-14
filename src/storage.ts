import AsyncStorage from "@react-native-async-storage/async-storage";

// In-memory fallback for environments where native storage isn't available (Expo web, missing native module)
const memoryStore: Record<string, string> = {};

const hasLocalStorage = typeof localStorage !== "undefined" && localStorage !== null;

export const setData = async (key: string, value: unknown) => {
	const str = JSON.stringify(value);
	// Try AsyncStorage first
	try {
		await AsyncStorage.setItem(key, str);
		return;
	} catch (e) {
		console.warn("AsyncStorage setItem failed, falling back:", e);
	}

	// Try browser localStorage (for web)
	try {
		if (hasLocalStorage) {
			localStorage.setItem(key, str);
			return;
		}
	} catch (e) {
		console.warn("localStorage setItem failed, falling back to memory:", e);
	}

	// Fallback to in-memory store (not persistent across reloads)
	memoryStore[key] = str;
};

export const getData = async (key: string) => {
	// Try AsyncStorage first
	try {
		const data = await AsyncStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (e) {
		console.warn("AsyncStorage getItem failed, falling back:", e);
	}

	// Try browser localStorage (for web)
	try {
		if (hasLocalStorage) {
			const data = localStorage.getItem(key);
			return data ? JSON.parse(data) : null;
		}
	} catch (e) {
		console.warn("localStorage getItem failed, falling back to memory:", e);
	}

	// Fallback to in-memory store
	try {
		const data = memoryStore[key];
		return data ? JSON.parse(data) : null;
	} catch (e) {
		console.warn("memoryStore parse failed:", e);
		return null;
	}
};