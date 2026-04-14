import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log('Save error', e)
  }
}

export const getData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.log('Get error', e)
    return null
  }
}

export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.log('Clear error', e)
  }
}