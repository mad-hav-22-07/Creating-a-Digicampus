// app/FirebaseProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";

import { useSchoolStore } from "./src/storage/useSchoolStore";

// ------------------ CONTEXT ------------------
const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

// ------------------ CONFIG -------------------
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;

const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// ------------------ PROVIDER ------------------
export function FirebaseProvider({ children }) {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);

  // Zustand realtime sync
  const startLiveSync = useSchoolStore((s) => s.startLiveSync);

  useEffect(() => {
    if (!firebaseConfig) {
      console.warn("⚠️ No Firebase config found.");
      setFirebaseReady(true);
      return;
    }

    try {
      // INITIALIZE FIREBASE
      const app = initializeApp(firebaseConfig);
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

          // 🔥 Start Firestore listeners AFTER Firebase login
          startLiveSync();
          console.log("📡 Firestore Live Sync Started");
        } catch (err) {
          console.error("Auth Error:", err);
        } finally {
          setFirebaseReady(true);
        }
      };

      authenticate();
    } catch (err) {
      console.error("🔥 Firebase Init Failed:", err);
      setFirebaseReady(true);
    }
  }, []);

  if (!firebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C5A52" />
        <Text style={styles.loadingText}>Connecting to database…</Text>
      </View>
    );
  }

  return (
    <FirebaseContext.Provider value={{ userId, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// ------------------ STYLES ------------------
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
    color: "#555",
    fontFamily: "Poppins_500Medium",
  },
});
