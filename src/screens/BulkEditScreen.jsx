// src/screens/BulkEditScreen.jsx
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

import StudentLayout from "../components/StudentLayout";
import { useClassStore } from "../store/classStore";

export default function BulkEditScreen() {
  const { classId } = useLocalSearchParams();

  const classes = useClassStore((s) => s.classes);
  const replaceClassStudents = useClassStore((s) => s.replaceClassStudents);

  // Load students
  const originalStudents =
    classes.find((c) => c.id === classId)?.students || [];

  const [editList, setEditList] = useState(
    originalStudents.map((s) => ({ ...s }))
  );

  const updateField = (id, field, value) => {
    setEditList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const validate = () => {
    const rollNums = editList.map((s) => Number(s.roll));

    const invalidRolls = rollNums.filter(
      (r) => isNaN(r) || r < 1 || !Number.isInteger(r)
    );

    if (invalidRolls.length > 0) {
      alert("Roll numbers must be whole numbers and greater than 0.");
      return false;
    }

    const duplicates = rollNums.filter(
      (roll, i) => rollNums.indexOf(roll) !== i
    );

    if (duplicates.length > 0) {
      alert(`Duplicate roll numbers: ${[...new Set(duplicates)].join(", ")}`);
      return false;
    }

    return true;
  };

  const saveAll = () => {
    if (!validate()) return;

    const updatedStudents = editList.map((s) => ({
      ...s,
      roll: Number(s.roll),
    }));

    replaceClassStudents(classId, updatedStudents);
    router.back();
  };

  return (
    <StudentLayout
      title="Bulk Edit"
      subtitle={`Class ${classId}`}
      icon="edit-3"
      backOffset={40}
      titleOffset={50}
    >
      {/* STUDENT ROWS */}
      <FlatList
        data={editList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const rollNum = Number(item.roll);
          const invalid =
            !item.roll ||
            isNaN(rollNum) ||
            rollNum < 1 ||
            !Number.isInteger(rollNum);

          return (
            <View style={styles.row}>
              {/* ROLL INPUT */}
              <TextInput
                style={[styles.roll, invalid && { borderColor: "red" }]}
                keyboardType="numeric"
                value={String(item.roll)}
                onChangeText={(val) => updateField(item.id, "roll", val)}
              />

              {/* NAME INPUT */}
              <TextInput
                style={styles.name}
                value={item.name}
                onChangeText={(val) => updateField(item.id, "name", val)}
              />
            </View>
          );
        }}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveAll}>
        <Text style={styles.saveText}>Save All</Text>
      </TouchableOpacity>
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#EEF6F4",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  roll: {
    width: 70,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    fontFamily: "DMSans-Medium",
    textAlign: "center",
    backgroundColor: "#FFF",
  },

  name: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    fontFamily: "DMSans-Medium",
  },

  saveBtn: {
    backgroundColor: "#0F5A52",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },

  saveText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "DMSans-Bold",
  },
});
