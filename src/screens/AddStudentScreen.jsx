// src/screens/AddStudentScreen.jsx
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function AddStudentScreen() {
  const { classId } = useLocalSearchParams();

  const classes = useClassStore((s) => s.classes);
  const addStudent = useClassStore((s) => s.addStudent);

  const currentClass = classes.find((c) => c.id === classId);

  // Auto-suggest next roll number
  const nextRoll = useMemo(() => {
    if (!currentClass?.students?.length) return 1;
    return Math.max(...currentClass.students.map((s) => Number(s.roll))) + 1;
  }, [currentClass]);

  const [roll, setRoll] = useState(String(nextRoll));
  const [name, setName] = useState("");

  const rollNum = Number(roll);

  // Validation
  const duplicateRoll =
    currentClass?.students.some((s) => s.roll === rollNum) ?? false;

  const invalidRoll =
    isNaN(rollNum) || rollNum < 1 || !Number.isInteger(rollNum);

  const saveStudent = () => {
    if (!roll || !name) {
      alert("Please fill all fields.");
      return;
    }

    if (invalidRoll) {
      alert("Roll number must be a positive whole number.");
      return;
    }

    if (duplicateRoll) {
      alert(`Roll number ${rollNum} already exists in Class ${classId}.`);
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      roll: rollNum,
      name,
    };

    addStudent(classId, newStudent);
    router.back();
  };

  return (
    <StudentLayout
      title="Add Student"
      subtitle={`Class ${classId}`}
      icon="user-plus"
      backOffset={35}
      titleOffset={65}
    >
      <View style={styles.container}>
        {/* INPUT: ROLL NUMBER */}
        <Text style={styles.label}>Roll Number</Text>
        <TextInput
          style={[
            styles.input,
            (duplicateRoll || invalidRoll) && styles.errorBorder,
          ]}
          placeholder="Enter roll number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={roll}
          onChangeText={setRoll}
        />

        {duplicateRoll && (
          <Text style={styles.errorText}>⚠ Roll number already exists!</Text>
        )}
        {invalidRoll && (
          <Text style={styles.errorText}>
            ⚠ Roll must be a positive whole number.
          </Text>
        )}

        {/* INPUT: NAME */}
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter student name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            (duplicateRoll || invalidRoll || !name) && styles.saveBtnDisabled,
          ]}
          disabled={duplicateRoll || invalidRoll || !name}
          onPress={saveStudent}
        >
          <Text style={styles.saveText}>Save Student</Text>
        </TouchableOpacity>
      </View>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },

  label: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: "#0F5A52",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    padding: 14,
    borderWidth: 1.4,
    borderColor: "#C8DAD6",
    backgroundColor: "#F7FCFA",
    borderRadius: 14,
    marginBottom: 6,
    fontSize: 15,
    fontFamily: "DMSans-Regular",
    color: "#222",
  },

  errorBorder: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 13,
    fontFamily: "DMSans-Medium",
  },

  saveBtn: {
    backgroundColor: "#0F5A52",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },

  saveBtnDisabled: {
    backgroundColor: "#9cc7c1",
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "DMSans-Bold",
  },
});
