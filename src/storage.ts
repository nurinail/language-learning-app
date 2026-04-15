import AsyncStorage from "@react-native-async-storage/async-storage";

// SAVE
export const setData = async (key: string, value: any) => {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (e) {
    console.log("SET ERROR", e);
  }
};

// GET
export const getData = async (key: string) => {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.log("GET ERROR", e);
    return null;
  }
};

// REMOVE (optional)
export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};