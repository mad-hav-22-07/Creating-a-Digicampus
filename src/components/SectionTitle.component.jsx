import { Text, View } from "react-native";

export default function SectionTitle({ title }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
    </View>
  );
}
