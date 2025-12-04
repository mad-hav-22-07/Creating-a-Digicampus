// src/components/Input.component.jsx
import React from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}) {
  return (
    <View style={styles.inputGroup}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Text Input */}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.textInput}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
        blurOnSubmit={true} // 🔥 allows keyboard to close
        onSubmitEditing={() => Keyboard.dismiss()} // 🔥 CLOSE KEYBOARD
        underlineColorAndroid="transparent"
        importantForAutofill="yes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#1C1C1C",
    marginBottom: 6,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
});
