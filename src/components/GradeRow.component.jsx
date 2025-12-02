import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function GradeRow({ grade, onChange, onRemove }) {
  return (
    <View style={styles.row}>
      <TextInput
        value={grade.name}
        placeholder="A"
        style={styles.input}
        onChangeText={(v) => onChange("name", v)}
      />
      <TextInput
        value={grade.min}
        placeholder="Min"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={(v) => onChange("min", v.replace(/[^0-9]/g, ""))}
      />
      <TextInput
        value={grade.max}
        placeholder="Max"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={(v) => onChange("max", v.replace(/[^0-9]/g, ""))}
      />
      <TouchableOpacity onPress={onRemove} style={styles.remove}>
        <Feather name="minus-circle" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  remove: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#FCECEC",
  },
});
