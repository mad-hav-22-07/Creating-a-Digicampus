import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BulkEditScreen() {
  const params = useLocalSearchParams();

  const classId = params.classId;
  const students = JSON.parse(params.students || "[]");
  const classes = JSON.parse(params.classes || "[]");

  // Clone list so editing doesn't mutate original
  const [editList, setEditList] = useState(students.map((s) => ({ ...s })));

  const updateField = (id, field, value) => {
    setEditList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const saveAll = () => {
    const updatedStudents = editList.map((s) => ({
      ...s,
      roll: Number(s.roll),
    }));

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
      <Text style={styles.header}>Bulk Edit — Class {classId}</Text>

      <FlatList
        data={editList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.roll}
              keyboardType="numeric"
              value={String(item.roll)}
              onChangeText={(val) => updateField(item.id, "roll", val)}
            />

            <TextInput
              style={styles.name}
              value={item.name}
              onChangeText={(val) => updateField(item.id, "name", val)}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveAll}>
        <Text style={styles.saveText}>Save All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  row: {
    flexDirection: "row",
    backgroundColor: "#eef6f4",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  roll: {
    width: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
  },

  name: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },

  saveBtn: {
    backgroundColor: "#0066ff",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
});
