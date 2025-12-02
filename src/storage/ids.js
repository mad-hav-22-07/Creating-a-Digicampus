// storage/ids.js

// Storage keys
export const KEY_CLASSES = "CLASSES";
export const KEY_EXAMS = "EXAMS";
export const KEY_STUDENTS = "STUDENTS"; // optional, but useful later

// ID generator
export const genId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
};
