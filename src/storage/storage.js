// app/admin/classManagement/storage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const KEY_CLASSES = "@myapp_classes_v1";
export const KEY_EXAMS = "@myapp_exams_v1";

// Id helper
export const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const loadJSON = async (key, fallback = []) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load", key, e);
    return fallback;
  }
};

export const saveJSON = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to save", key, e);
  }
};
