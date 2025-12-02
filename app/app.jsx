import React, { createContext, useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
} from "firebase/auth";

// --- Global Context for Auth/DB ---
const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

// --- Global Variables (Provided by Canvas Environment) ---
// NOTE: We assume __app_id, __firebase_config, and __initial_auth_token are defined globally.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null;
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// --- Firebase Initialization and Authentication Logic ---
export const FirebaseProvider = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    if (!firebaseConfig) {
      console.error("Firebase Config is missing. Cannot initialize Firebase.");
      return;
    }

    // 1. Initialize App (Avoids duplicate app error)
    try {
      const app = initializeApp(firebaseConfig, appId);
      const authInstance = getAuth(app);
      setAuth(authInstance);

      // 2. Handle Authentication
      const authenticate = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            // Fallback to anonymous sign-in if no token is provided
            await signInAnonymously(authInstance);
          }
          const currentUser = authInstance.currentUser;
          setUserId(currentUser?.uid || "anonymous");
        } catch (error) {
          console.error("Firebase Authentication Error:", error);
          // This is where auth/invalid-api-key or other auth errors appear.
          // We proceed anonymously if auth fails.
          await signInAnonymously(authInstance);
          setUserId(authInstance.currentUser?.uid || "anonymous");
        } finally {
          setAuthReady(true);
        }
      };

      authenticate();
    } catch (e) {
      console.error("Firebase Initialization Error:", e.code, e.message);
      // Ignore the "duplicate-app" error if it happens during hot reload, but halt
      // if it's the critical "invalid-api-key" error.
      if (e.code === "app/invalid-api-key") {
        console.error(
          "FATAL: Firebase API Key is invalid. Check __firebase_config."
        );
      }
      setAuthReady(true); // Allow app to render even if Firebase failed to initialize completely
    }
  }, []);

  if (!authReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          Initializing Firebase & Authentication...
        </Text>
      </View>
    );
  }

  const contextValue = {
    userId,
    auth,
    appId,
    isAuthReady: authReady,
    // Add Firestore instance here once initialized (e.g., db)
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Expo Router Entry Component (REQUIRED) ---
// This is the file the router looks for to wrap the app.
export default function App() {
  return (
    <FirebaseProvider>
      {/* The root layout (app/_layout.js) and all routes will be rendered here. 
        Note: The actual <Stack> navigator rendering is handled by the 
        default Expo Router structure, but we wrap the content with our Provider.
      */}
    </FirebaseProvider>
  );
}

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
