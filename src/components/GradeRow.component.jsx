// src/components/GradeRow.component.jsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function GradeRow({ grade, onChange, onRemove }) {
  return (
    <View style={styles.row}>
      {/* Grade label (A, B, C...) */}
      <TextInput
        value={grade.name}
        placeholder="A"
        style={[styles.input, styles.smallInput]}
        placeholderTextColor="#9CA3AF"
        onChangeText={(v) => onChange("name", v)}
      />

      {/* Min */}
      <TextInput
        value={grade.min}
        placeholder="Min"
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        onChangeText={(v) => onChange("min", v.replace(/[^0-9]/g, ""))}
      />

      {/* Max */}
      <TextInput
        value={grade.max}
        placeholder="Max"
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        onChangeText={(v) => onChange("max", v.replace(/[^0-9]/g, ""))}
      />

      {/* Remove Button */}
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Feather name="minus-circle" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },

  smallInput: {
    flex: 0.5,
    textAlign: "center",
  },

  removeButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "#FDE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
});
