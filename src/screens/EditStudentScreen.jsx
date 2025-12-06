// src/screens/EditStudentScreen.jsx

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function EditStudentScreen() {
  const { classId, studentId } = useLocalSearchParams();

  const classes = useClassStore((s) => s.classes);
  const updateStudent = useClassStore((s) => s.updateStudent);

  const classData = classes.find((c) => c.id === classId);
  const student = classData?.students.find((s) => s.id === studentId);

  const [roll, setRoll] = useState(String(student.roll));
  const [name, setName] = useState(student.name);

  const saveChanges = () => {
    if (!roll || !name) {
      alert("Please fill all fields.");
      return;
    }

    const newRoll = Number(roll);

    // Check duplicate roll (excluding current student)
    const duplicate = classData.students.some(
      (s) => s.id !== studentId && s.roll === newRoll
    );

    if (duplicate) {
      alert(`Roll number ${newRoll} already exists in this class!`);
      return;
    }

    updateStudent(classId, studentId, {
      roll: newRoll,
      name,
    });

    router.back();
  };

  return (
    <StudentLayout
      title="Edit Student"
      subtitle={`Class ${classId}`}
      icon="edit-3"
      backOffset={40}
      titleOffset={50}
    >
      <View style={styles.form}>
        {/* ROLL NUMBER */}
        <Text style={styles.label}>Roll Number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={roll}
          onChangeText={setRoll}
          placeholder="Enter roll"
          placeholderTextColor="#999"
        />

        {/* NAME */}
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor="#999"
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: "#444",
    marginBottom: 6,
  },

  input: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    fontSize: 16,
    fontFamily: "DMSans-Regular",
    marginBottom: 18,
    backgroundColor: "#F9F9F9",
  },

  saveBtn: {
    backgroundColor: "#0F5A52",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "DMSans-Bold",
  },
});
