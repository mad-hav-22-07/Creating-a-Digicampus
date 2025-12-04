// src/firebase/db.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These globals are already used in app/app.jsx
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

let db = null;

if (firebaseConfig) {
  // Avoid "Firebase app already exists" error
  const existing = getApps().find((a) => a.name === appId);
  const app = existing || initializeApp(firebaseConfig, appId);
  db = getFirestore(app);
} else {
  console.warn("No __firebase_config found. Firestore disabled.");
}

export { db };
