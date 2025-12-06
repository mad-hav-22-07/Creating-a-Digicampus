// src/screens/ViewClassStudents.jsx
import { useMemo, useState } from "react";
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

export default function ViewClassStudents({ classId }) {
  const classes = useClassStore((s) => s.classes);

  const safeClassId = String(classId || "");
  const classData = classes.find((c) => String(c.id) === safeClassId);

  // If class not found
  if (!classData) {
    return (
      <StudentLayout
        title="Class Not Found"
        subtitle={`Class ${safeClassId}`}
        icon="users"
        backOffset={40}
        titleOffset={70}
      >
        <Text style={styles.notFoundText}>
          This class may have been deleted or never created.
        </Text>
      </StudentLayout>
    );
  }

  const students = Array.isArray(classData.students) ? classData.students : [];

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("roll-asc");

  // Filter + Sort
  const filteredStudents = useMemo(() => {
    let data = [...students];

    data = data.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toString().includes(search)
    );

    switch (sortMode) {
      case "roll-asc":
        return data.sort((a, b) => a.roll - b.roll);
      case "roll-desc":
        return data.sort((a, b) => b.roll - a.roll);
      case "name-asc":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return data.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return data;
    }
  }, [students, search, sortMode]);

  return (
    <StudentLayout
      title="Students"
      subtitle={`Class ${safeClassId}`}
      icon="users"
      backOffset={40}
      titleOffset={70} // THIS FIXES YOUR ISSUE
    >
      {/* Search Box */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search by name or roll..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {/* Sorting */}
      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSortMode("roll-asc")}>
          <Text style={styles.sortBtn}>Roll ↑</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortMode("roll-desc")}>
          <Text style={styles.sortBtn}>Roll ↓</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortMode("name-asc")}>
          <Text style={styles.sortBtn}>A–Z</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortMode("name-desc")}>
          <Text style={styles.sortBtn}>Z–A</Text>
        </TouchableOpacity>
      </View>

      {students.length === 0 && (
        <Text style={styles.noStudents}>No students in this class.</Text>
      )}

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentText}>
              {item.roll}. {item.name}
            </Text>
          </View>
        )}
      />
    </StudentLayout>
  );
}

const styles = StyleSheet.create({
  notFoundText: {
    color: "#777",
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    textAlign: "center",
    marginTop: 40,
  },

  searchBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    fontSize: 16,
    fontFamily: "DMSans-Regular",
    marginBottom: 14,
    backgroundColor: "#F9F9F9",
  },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EEF6F4",
    borderRadius: 10,
    fontFamily: "DMSans-Medium",
    color: "#0F5A52",
  },

  noStudents: {
    marginTop: 20,
    color: "#999",
    fontFamily: "DMSans-Regular",
    fontSize: 15,
  },

  studentItem: {
    padding: 15,
    backgroundColor: "#EEF6F4",
    borderRadius: 14,
    marginBottom: 10,
  },

  studentText: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    color: "#333",
  },
});
