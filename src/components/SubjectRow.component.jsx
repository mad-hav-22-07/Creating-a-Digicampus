import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SubjectRow({ value, onChange, onRemove }) {
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Subject"
        style={styles.input}
      />
      <TouchableOpacity onPress={onRemove} style={styles.remove}>
        <Feather name="trash-2" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  remove: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#FCECEC",
  },
});
