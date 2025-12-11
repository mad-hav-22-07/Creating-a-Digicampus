// src/components/SectionTitle.component.jsx
import { View, Text } from "react-native";
import { styles } from "../styles/styles";
import { Feather } from "@expo/vector-icons";

export default function SectionTitle({ title, icon }) {
  return (
    <View style={styles.sectionTitleRow}>
      {icon && <Feather name={icon} size={18} color="#1C5A52" />}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}
