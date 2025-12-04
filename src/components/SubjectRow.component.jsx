// src/components/SubjectRow.component.jsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SubjectRow({ value, onChange, onRemove }) {
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Subject name"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        style={styles.removeBtn}
      >
        <Feather name="trash-2" size={20} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },

  removeBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#FCECEC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
