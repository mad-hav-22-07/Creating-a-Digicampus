import { Text } from "react-native";
import { styles } from "../styles/styles";

export default function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}
