import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditStudentScreen() {
  const params = useLocalSearchParams();

  const classId = params.classId;
  const student = JSON.parse(params.student);
  const students = JSON.parse(params.students || "[]");
  const classes = JSON.parse(params.classes || "[]");

  const [roll, setRoll] = useState(String(student.roll));
  const [name, setName] = useState(student.name);

  const saveChanges = () => {
    if (!roll || !name) {
      alert("Please fill all fields.");
      return;
    }

    // Update student inside the list
    const updatedStudents = students.map((s) =>
      s.id === student.id ? { ...s, roll: Number(roll), name } : s
    );

    const updatedClasses = classes.map((cls) =>
      cls.id === classId ? { ...cls, students: updatedStudents } : cls
    );

    // Navigate back to EditStudentList
    router.push({
      pathname: `/students/${classId}`,
      params: {
        students: JSON.stringify(updatedStudents),
        classes: JSON.stringify(updatedClasses),
        updated: "true",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Student — Class {classId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Roll Number"
        keyboardType="numeric"
        value={roll}
        onChangeText={setRoll}
      />

      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },

  saveBtn: {
    backgroundColor: "#0066ff",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
});
