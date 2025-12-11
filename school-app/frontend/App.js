import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import Home_Page from "./src/screens/Home_Page"
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <StatusBar barStyle="light-content" />
      <Home_Page  />
    </SafeAreaView>
  );
}
