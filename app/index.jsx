import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        School Management
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#1C5A52",
          borderRadius: 10,
        }}
        onPress={() => router.push("/admin/classManagement")}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Admin Panel</Text>
      </TouchableOpacity>
    </View>
  );
}
