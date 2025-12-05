import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditStudentList() {
  const params = useLocalSearchParams();

  const classId = params.classId;
  const classes = JSON.parse(params.classes || "[]");

  const initialStudents = classes.find((c) => c.id === classId)?.students || [];

  const [students, setStudents] = useState(initialStudents);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("roll-asc");

  const sortByRoll = (list) => [...list].sort((a, b) => a.roll - b.roll);

  // Update class list in parent screen
  useEffect(() => {
    const updatedClasses = classes.map((cls) =>
      cls.id === classId ? { ...cls, students: sortByRoll(students) } : cls
    );

    // Update StudentHomeScreen
    router.setParams({
      classes: JSON.stringify(updatedClasses),
    });
  }, [students]);

  // ============================
  // Delete a student
  // ============================
  const handleDelete = (id) => {
    const target = students.find((s) => s.id === id);

    Alert.alert(
      "Delete Student?",
      `Remove ${target.name} (Roll ${target.roll}) from Class ${classId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setStudents((prev) => prev.filter((s) => s.id !== id));
          },
        },
      ]
    );
  };

  // ============================
  // Delete Entire Class
  // ============================
  const deleteClass = () => {
    Alert.alert(
      "Delete Entire Class?",
      `This will completely remove Class ${classId}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = classes.filter((c) => c.id !== classId);

            router.push({
              pathname: "/",
              params: { classes: JSON.stringify(updated) },
            });
          },
        },
      ]
    );
  };

  // ============================
  // Filter + Sort students
  // ============================
  const filteredStudents = useMemo(() => {
    let data = [...students];

    data = data.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toString().includes(search)
    );

    switch (sortMode) {
      case "roll-asc":
        data.sort((a, b) => a.roll - b.roll);
        break;
      case "roll-desc":
        data.sort((a, b) => b.roll - a.roll);
        break;
      case "name-asc":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return data;
  }, [students, search, sortMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Records — Class {classId}</Text>

      {/* Delete Entire Class */}
      <TouchableOpacity style={styles.deleteClassBtn} onPress={deleteClass}>
        <Text style={styles.deleteClassText}>Delete Entire Class</Text>
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search by name or roll"
        value={search}
        onChangeText={setSearch}
      />

      {/* Sort Buttons */}
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

      {/* Bulk Edit + Replace Excel */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push({
              pathname: `/students/${classId}/bulk`,
              params: {
                students: JSON.stringify(students),
                classes: JSON.stringify(classes),
              },
            })
          }
        >
          <Text style={styles.actionText}>Bulk Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            router.push({
              pathname: "/upload",
              params: {
                replaceMode: "true",
                classId,
                classList: classes.map((c) => c.id).join(","),
              },
            })
          }
        >
          <Text style={styles.actionText}>Replace Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                router.push({
                  pathname: `/students/${classId}/edit`,
                  params: {
                    student: JSON.stringify(item),
                    students: JSON.stringify(students),
                    classes: JSON.stringify(classes),
                  },
                })
              }
            >
              <Text style={styles.studentText}>
                {item.roll}. {item.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Student */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push({
            pathname: `/students/${classId}/add`,
            params: {
              students: JSON.stringify(students),
              classes: JSON.stringify(classes),
            },
          })
        }
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  deleteClassBtn: {
    backgroundColor: "#ffe5e5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  deleteClassText: { color: "#d00", fontSize: 16, fontWeight: "700" },

  searchBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
  },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  actionBtn: {
    backgroundColor: "#fdeee7",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  actionText: { fontSize: 15, fontWeight: "600" },

  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eef6f4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  studentText: { fontSize: 17, fontWeight: "600" },

  deleteBtn: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: { fontSize: 20, color: "red" },

  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0066ff",
    position: "absolute",
    bottom: 25,
    right: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  addBtnText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
});
