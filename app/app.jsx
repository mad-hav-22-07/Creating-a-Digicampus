import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
} from "firebase/auth";
import { Slot } from "expo-router"; // ⭐ REQUIRED
import { useSchoolStore } from "../src/storage/useSchoolStore";

// --- Firebase Context ---
const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

// --- Global Variables ---
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// --- Firebase Provider ---
export const FirebaseProvider = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    if (!firebaseConfig) return;

    try {
      const app = initializeApp(firebaseConfig, appId);
      const authInstance = getAuth(app);
      setAuth(authInstance);

      const authenticate = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }
          setUserId(authInstance.currentUser?.uid || "anonymous");
        } catch (err) {
          console.error("Auth error:", err);
          await signInAnonymously(authInstance);
          setUserId(authInstance.currentUser?.uid || "anonymous");
        } finally {
          setAuthReady(true);
        }
      };

      authenticate();
    } catch (e) {
      console.error("Firebase init failed:", e);
      setAuthReady(true);
    }
  }, []);

  if (!authReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Initializing Firebase…</Text>
      </View>
    );
  }

  return (
    <FirebaseContext.Provider value={{ userId, auth, appId }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// --- ROOT ENTRY ---
export default function App() {
  const loadData = useSchoolStore((s) => s.loadData);

  useEffect(() => {
    loadData(); // Load local DB (classes, exams)
  }, []);

  return (
    <FirebaseProvider>
      <Slot /> {/* ⭐ MUST BE HERE — renders all routes */}
    </FirebaseProvider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
