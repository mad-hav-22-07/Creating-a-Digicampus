// src/components/BackButton.component.jsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function BackButton({ topOffset = 0 }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.7}
      style={{
        position: "absolute",
        left: 18,
        top: 60 + topOffset, // easy to move up/down
        zIndex: 999,
      }}
    >
      <View>
        <Feather
          name="arrow-left"
          size={22}
          color="#e49534ff" // clean white arrow to match header
        />
      </View>
    </TouchableOpacity>
  );
}
