import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function AdminHome() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Admin Dashboard</Text>

      <Link href="/admin/classManagement" asChild>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 14,
            backgroundColor: "#1C5A52",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Class Management
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/admin/examManagement" asChild>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 14,
            backgroundColor: "#174A44",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Exam Management
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
