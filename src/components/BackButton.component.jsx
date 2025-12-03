// src/components/BackButton.component.jsx
import { TouchableOpacity, View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function BackButton({ topOffset = 0 }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.7}
      style={{
        position: "absolute",
        left: 15,
        top: 0 + topOffset, // ← now adjustable!!
        zIndex: 999,
      }}
    >
      <View style={{}}>
        <Text
          style={{
            fontSize: 30,
            color: "#ea8f75ff",
            fontWeight: "700",
          }}
        >
          ←
        </Text>
      </View>
    </TouchableOpacity>
  );
}
