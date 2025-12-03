import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.textInput}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        /** 🔥 Keeps keyboard open when typing */
        blurOnSubmit={false}
        /** 🔥 Prevents keyboard flicker inside FlatList */
        underlineColorAndroid="transparent"
        /** 🔥 Makes input smoother in FlatList */
        importantForAutofill="yes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 14 },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#1C1C1C",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});
