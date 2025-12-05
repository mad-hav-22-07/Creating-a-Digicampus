import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddStudentScreen() {
  const params = useLocalSearchParams();

  const classId = params.classId;
  const students = JSON.parse(params.students || "[]");

  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");

  const saveStudent = () => {
    if (!roll || !name) {
      alert("Please fill all fields.");
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      roll: Number(roll),
      name,
    };

    const updatedStudents = [...students, newStudent];

    // Navigate back to EditStudentList with updated data
    router.push({
      pathname: `/students/${classId}`,
      params: {
        students: JSON.stringify(updatedStudents),
        updated: "true",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Student — Class {classId}</Text>

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

      <TouchableOpacity style={styles.saveBtn} onPress={saveStudent}>
        <Text style={styles.saveText}>Save</Text>
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
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
