import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SmallIconButton({ icon, color, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Feather name={icon} size={18} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E9F4F2",
    marginBottom: 6,
  },
});
